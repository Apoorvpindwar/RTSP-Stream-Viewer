# RTSP Stream Viewer

A web application for viewing and managing RTSP streams, built with React, TypeScript, and Django.

## Features

- View multiple RTSP streams simultaneously
- Add, remove, and manage stream connections
- Real-time stream status monitoring
- Responsive design with dark mode support

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- WebSocket for real-time updates

### Backend
- Django
- Django REST Framework
- Django Channels
- OpenCV for video processing
- FFmpeg for stream handling

## Deployment

### Frontend (Vercel)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

### Environment Variables

Set the following environment variables in your Vercel project settings:

- `VITE_API_URL`: Your backend API URL
- `VITE_WS_URL`: Your WebSocket URL

### Backend (Separate Deployment)

The backend should be deployed separately on a platform that supports WebSocket connections (e.g., DigitalOcean, Heroku, etc.).

Required environment variables:
- `DJANGO_SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## License

MIT