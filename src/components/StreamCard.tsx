import React, { useState } from 'react';
import { Play, Pause, X, AlertCircle, Info, Settings, ExternalLink } from 'lucide-react';
import { Stream } from '../types/stream';

interface StreamCardProps {
  stream: Stream;
  onTogglePlay: () => void;
  onRemoveStream: () => void;
}

const StreamCard: React.FC<StreamCardProps> = ({ 
  stream, 
  onTogglePlay, 
  onRemoveStream 
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const getStatusColor = () => {
    if (stream.last_error) return 'bg-red-500';
    if (stream.is_active) return 'bg-green-500';
    return 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
      <div className="relative">
        {/* Status indicator */}
        <div className="absolute top-3 right-3 z-10 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
        </div>

        {/* Stream display area */}
        <div className="aspect-video bg-black relative flex items-center justify-center group">
          {stream.last_error ? (
            <div className="text-center p-4">
              <AlertCircle className="mx-auto mb-2 text-red-500" size={32} />
              <p className="text-red-400 text-sm">Error: {stream.last_error}</p>
            </div>
          ) : !stream.is_active ? (
            <div className="text-center p-4">
              <p className="text-gray-400">Stream paused</p>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center">
              <p className="text-teal-500">Streaming from: {stream.name}</p>
            </div>
          )}
          
          {/* Stream controls overlay - visible on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium truncate mr-2">{stream.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-1.5 bg-gray-600 hover:bg-gray-500 rounded-full text-white transition-colors duration-200"
                >
                  <Info size={18} />
                </button>
                <button
                  onClick={onTogglePlay}
                  className="p-1.5 bg-teal-600 hover:bg-teal-500 rounded-full text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!!stream.last_error}
                >
                  {stream.is_active ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                  onClick={onRemoveStream}
                  className="p-1.5 bg-red-600 hover:bg-red-500 rounded-full text-white transition-colors duration-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stream info panel */}
      <div className={`bg-gray-900 transition-all duration-300 ${showInfo ? 'max-h-48' : 'max-h-0'} overflow-hidden`}>
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Status:</span>
            <span className={`px-2 py-0.5 rounded ${stream.is_active ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
              {stream.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Created:</span>
            <span className="text-gray-300">{formatDate(stream.created_at)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Last Updated:</span>
            <span className="text-gray-300">{formatDate(stream.updated_at)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Reconnection Attempts:</span>
            <span className="text-gray-300">{stream.reconnection_attempts}</span>
          </div>
        </div>
      </div>

      {/* Stream URL footer */}
      <div className="p-3 border-t border-gray-700 flex items-center justify-between">
        <p className="text-gray-400 text-xs truncate flex-1">{stream.url}</p>
        <a 
          href={stream.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-2 text-teal-500 hover:text-teal-400 transition-colors duration-200"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default StreamCard;