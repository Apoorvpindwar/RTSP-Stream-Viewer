from django.db import models
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError

class Stream(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_error = models.TextField(null=True, blank=True)
    reconnection_attempts = models.IntegerField(default=0)

    def clean(self):
        if not self.url.startswith('rtsp://'):
            raise ValidationError('URL must be an RTSP stream')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at'] 