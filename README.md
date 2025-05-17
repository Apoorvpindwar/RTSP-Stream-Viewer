# RTSP Stream Viewer

A web application for viewing and managing RTSP streams, built with React, TypeScript, and Django. This application allows users to add, manage, and view multiple RTSP camera streams in real-time through a web interface.

## Features

- View multiple RTSP streams simultaneously in a responsive grid layout
- Add, remove, and manage stream connections
- Real-time stream status monitoring
- Automatic reconnection on stream failure
- Dark mode support
- Stream controls (play/pause)
- Error handling and status indicators
- WebSocket-based real-time streaming
- Mobile-responsive design

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- WebSocket for real-time updates
- Lucide React for icons

### Backend
- Django 4.2
- Django REST Framework
- Django Channels for WebSocket support
- OpenCV for video processing
- FFmpeg for stream handling
- Redis for WebSocket channel layer

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- Python 3.9 or higher
- FFmpeg
- Redis server
- Git

## Installation

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Apoorvpindwar/RTSP-Stream-Viewer.git
   cd RTSP-Stream-Viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_WS_URL=ws://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a .env file in the backend directory:
   ```env
   DJANGO_SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the backend server:
   ```bash
   python manage.py runserver
   ```

## API Documentation

### REST Endpoints

- `GET /api/streams/` - List all streams
- `POST /api/streams/` - Create a new stream
  ```json
  {
    "name": "Camera 1",
    "url": "rtsp://example.com/stream1"
  }
  ```
- `GET /api/streams/{id}/` - Get stream details
- `PUT /api/streams/{id}/` - Update stream
- `DELETE /api/streams/{id}/` - Delete stream
- `POST /api/streams/{id}/activate/` - Activate stream
- `POST /api/streams/{id}/deactivate/` - Deactivate stream

### WebSocket API

Connect to: `ws://localhost:8000/ws/stream/{stream_id}/`

Messages from client:
```json
{
  "command": "start|stop"
}
```

Messages from server:
```json
{
  "type": "frame",
  "frame_data": "base64_encoded_jpeg",
  "stream_id": "stream_id"
}
```

## Configuration

### FFmpeg Settings

The application uses FFmpeg for stream processing with the following default settings:
- Video codec: H.264
- Frame rate: 30 fps
- Resolution: 1920x1080
- Transport protocol: TCP

### Stream Reconnection

- Maximum reconnection attempts: 3
- Reconnection delay: 5 seconds
- Timeout: 30 seconds

## Troubleshooting

### Common Issues

1. Stream Connection Failures
   - Verify RTSP URL is correct and accessible
   - Check network connectivity
   - Ensure FFmpeg is properly installed

2. Backend Server Issues
   - Verify Redis server is running
   - Check Django server logs
   - Ensure all environment variables are set

3. Frontend Connection Issues
   - Verify API_URL and WS_URL in .env
   - Check browser console for errors
   - Ensure CORS settings are correct

## Security Considerations

- RTSP streams should be properly authenticated
- Use HTTPS in production
- Implement user authentication if needed
- Secure WebSocket connections with WSS
- Configure CORS properly
- Set secure Django settings in production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT

## Contact

Apoorv Pindwar - [@ApoorvPindwar](https://github.com/Apoorvpindwar)

Project Link: [https://github.com/Apoorvpindwar/RTSP-Stream-Viewer](https://github.com/Apoorvpindwar/RTSP-Stream-Viewer)