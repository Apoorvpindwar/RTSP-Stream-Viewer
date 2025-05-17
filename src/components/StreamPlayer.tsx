import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Trash2, AlertCircle } from 'lucide-react';
import { Stream } from '../types/stream';

interface StreamPlayerProps {
  stream: Stream;
  onToggle: () => void;
  onDelete: () => void;
}

const StreamPlayer: React.FC<StreamPlayerProps> = ({ stream, onToggle, onDelete }) => {
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (stream.is_active && !ws.current) {
      connectWebSocket();
    }
    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [stream.is_active]);

  const connectWebSocket = () => {
    setIsConnecting(true);
    setError(null);

    const wsUrl = `${process.env.REACT_APP_WS_URL}/ws/stream/${stream.id}/`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      setIsConnecting(false);
      socket.send(JSON.stringify({ command: 'start' }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'frame' && imageRef.current) {
        imageRef.current.src = `data:image/jpeg;base64,${data.frame_data}`;
      } else if (data.type === 'error') {
        setError(data.message);
        socket.close();
      }
    };

    socket.onerror = () => {
      setError('Connection error');
      setIsConnecting(false);
    };

    socket.onclose = () => {
      setIsConnecting(false);
      ws.current = null;
    };

    ws.current = socket;
  };

  const handleToggle = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    onToggle();
  };

  return (
    <div className="relative">
      <div className="aspect-video bg-gray-900 relative">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>{error}</span>
          </div>
        ) : (
          <img
            ref={imageRef}
            className="w-full h-full object-contain"
            alt={stream.name}
          />
        )}
        {isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            Connecting...
          </div>
        )}
      </div>
      
      <div className="p-4 bg-white border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold truncate">{stream.name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleToggle}
              className={`p-2 rounded-full ${
                stream.is_active
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
            >
              {stream.is_active ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1 truncate">{stream.url}</p>
      </div>
    </div>
  );
};

export default StreamPlayer; 