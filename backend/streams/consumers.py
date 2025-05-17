import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .services import StreamProcessor
from .models import Stream
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class StreamConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.stream_processor = None
        self.stream_id = None

    async def connect(self):
        self.stream_id = self.scope['url_route']['kwargs']['stream_id']
        self.room_group_name = f'stream_{self.stream_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        if self.stream_processor:
            await self.stream_processor.stop()

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            command = data.get('command')

            if command == 'start':
                if not self.stream_processor:
                    stream = await self.get_stream()
                    if stream and stream.is_active:
                        self.stream_processor = StreamProcessor(self.stream_id, stream.url)
                        await self.stream_processor.start()
                    else:
                        await self.send(json.dumps({
                            'type': 'error',
                            'message': 'Stream not found or inactive'
                        }))

            elif command == 'stop':
                if self.stream_processor:
                    await self.stream_processor.stop()
                    self.stream_processor = None

        except Exception as e:
            logger.error(f"Error in receive: {str(e)}")
            await self.send(json.dumps({
                'type': 'error',
                'message': str(e)
            }))

    async def stream_frame(self, event):
        await self.send(json.dumps({
            'type': 'frame',
            'frame_data': event['frame_data'],
            'stream_id': event['stream_id']
        }))

    async def stream_error(self, event):
        await self.send(json.dumps({
            'type': 'error',
            'message': event['error'],
            'stream_id': event['stream_id']
        }))

    @staticmethod
    async def get_stream():
        try:
            return await Stream.objects.aget(id=self.stream_id)
        except Stream.DoesNotExist:
            return None 