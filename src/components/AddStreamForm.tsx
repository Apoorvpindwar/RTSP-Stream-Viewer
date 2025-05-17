import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddStreamFormProps {
  onAddStream: (url: string, name: string) => void;
}

const AddStreamForm: React.FC<AddStreamFormProps> = ({ onAddStream }) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!url.trim()) {
      setError('Stream URL is required');
      return false;
    }
    
    // Basic URL validation - in production, you'd want more robust validation
    if (!url.trim().startsWith('rtsp://')) {
      setError('URL must be a valid RTSP stream URL starting with rtsp://');
      return false;
    }
    
    if (!name.trim()) {
      setError('Stream name is required');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddStream(url, name);
      setUrl('');
      setName('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6 shadow-md">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center p-3 bg-blue-700 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
        >
          <Plus size={20} className="mr-2" />
          Add Stream
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="stream-name" className="block text-sm font-medium text-gray-300 mb-1">
              Stream Name
            </label>
            <input
              id="stream-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Security Camera"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
            />
          </div>
          
          <div>
            <label htmlFor="stream-url" className="block text-sm font-medium text-gray-300 mb-1">
              RTSP Stream URL
            </label>
            <input
              id="stream-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="rtsp://example.com/stream"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm py-2">{error}</div>
          )}
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setError(null);
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-md transition-colors duration-200"
            >
              Add Stream
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddStreamForm;