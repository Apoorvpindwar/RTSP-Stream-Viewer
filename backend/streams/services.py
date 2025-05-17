import cv2
import numpy as np
import base64
import logging
import asyncio
import subprocess
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.conf import settings
import ffmpeg

logger = logging.getLogger(__name__)

class StreamProcessor:
    def __init__(self, stream_id, url):
        self.stream_id = stream_id
        self.url = url
        self.process = None
        self.is_running = False
        self.channel_layer = get_channel_layer()
        self.reconnection_attempts = 0

    async def start(self):
        if self.is_running:
            return
        
        self.is_running = True
        while self.is_running and self.reconnection_attempts < settings.RECONNECTION_ATTEMPTS:
            try:
                process = (
                    ffmpeg
                    .input(self.url, rtsp_transport='tcp')
                    .output('pipe:', format='rawvideo', pix_fmt='rgb24')
                    .overwrite_output()
                    .run_async(pipe_stdout=True)
                )
                
                self.process = process
                self.reconnection_attempts = 0

                while self.is_running:
                    frame_size = 1920 * 1080 * 3  # Adjust based on your stream resolution
                    in_bytes = await self.process.stdout.read(frame_size)
                    
                    if not in_bytes:
                        break

                    # Convert to numpy array and reshape
                    frame = np.frombuffer(in_bytes, np.uint8).reshape([1080, 1920, 3])
                    
                    # Encode frame to JPEG
                    _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                    frame_data = base64.b64encode(buffer).decode('utf-8')
                    
                    # Send frame through WebSocket
                    await self.channel_layer.group_send(
                        f"stream_{self.stream_id}",
                        {
                            "type": "stream.frame",
                            "frame_data": frame_data,
                            "stream_id": self.stream_id,
                        }
                    )
                    
                    await asyncio.sleep(0.033)  # ~30 FPS

            except Exception as e:
                logger.error(f"Stream {self.stream_id} error: {str(e)}")
                self.reconnection_attempts += 1
                if self.reconnection_attempts < settings.RECONNECTION_ATTEMPTS:
                    await asyncio.sleep(settings.RECONNECTION_DELAY)
                else:
                    await self.channel_layer.group_send(
                        f"stream_{self.stream_id}",
                        {
                            "type": "stream.error",
                            "error": str(e),
                            "stream_id": self.stream_id,
                        }
                    )
                    break

    async def stop(self):
        self.is_running = False
        if self.process:
            try:
                self.process.kill()
            except:
                pass
            self.process = None 