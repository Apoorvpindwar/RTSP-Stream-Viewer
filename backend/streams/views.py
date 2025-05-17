from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Stream
from .serializers import StreamSerializer
from .services import StreamProcessor
import logging
from rest_framework import generics

logger = logging.getLogger(__name__)

class StreamViewSet(viewsets.ModelViewSet):
    queryset = Stream.objects.all()
    serializer_class = StreamSerializer

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        stream = self.get_object()
        stream.is_active = True
        stream.save()
        return Response({'status': 'stream activated'})

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        stream = self.get_object()
        stream.is_active = False
        stream.save()
        return Response({'status': 'stream deactivated'})

    def perform_create(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            logger.error(f"Error creating stream: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_destroy(self, instance):
        try:
            instance.delete()
        except Exception as e:
            logger.error(f"Error deleting stream: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class StreamListView(generics.ListCreateAPIView):
    queryset = Stream.objects.all()
    serializer_class = StreamSerializer

class StreamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Stream.objects.all()
    serializer_class = StreamSerializer 