"""
WSGI config for rtsp_server project.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rtsp_server.settings')

application = get_wsgi_application() 