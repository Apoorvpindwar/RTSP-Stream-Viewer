from rest_framework import serializers
from .models import Stream

class StreamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stream
        fields = ['id', 'name', 'url', 'is_active', 'created_at', 'updated_at', 'last_error', 'reconnection_attempts']
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_error', 'reconnection_attempts']

    def validate_url(self, value):
        if not value.startswith('rtsp://'):
            raise serializers.ValidationError("URL must be an RTSP stream")
        return value 