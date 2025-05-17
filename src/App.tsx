import React, { useState, useEffect } from 'react';
import { Plus, Moon, Sun, Search, Filter } from 'lucide-react';
import StreamGrid from './components/StreamGrid';
import { Stream } from './types/stream';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Log environment variables
console.log('Environment Variables:', {
  API_URL: import.meta.env.VITE_API_URL,
  WS_URL: import.meta.env.VITE_WS_URL
});

function App() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [newStreamName, setNewStreamName] = useState('');
  const [newStreamUrl, setNewStreamUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchStreams();
    // Apply dark mode class
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const fetchStreams = async () => {
    try {
      const response = await fetch(`${API_URL}/streams/`);
      if (!response.ok) throw new Error('Failed to fetch streams');
      const data = await response.json();
      setStreams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch streams');
    }
  };

  const handleAddStream = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_URL}/streams/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newStreamName,
          url: newStreamUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add stream');
      }

      const newStream = await response.json();
      setStreams([...streams, newStream]);
      setNewStreamName('');
      setNewStreamUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add stream');
    }
  };

  const handleStreamToggle = async (streamId: number) => {
    try {
      const stream = streams.find(s => s.id === streamId);
      if (!stream) return;

      const action = stream.is_active ? 'deactivate' : 'activate';
      const response = await fetch(`${API_URL}/streams/${streamId}/${action}/`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error(`Failed to ${action} stream`);

      setStreams(streams.map(s =>
        s.id === streamId ? { ...s, is_active: !s.is_active } : s
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to toggle stream`);
    }
  };

  const handleStreamDelete = async (streamId: number) => {
    try {
      const response = await fetch(`${API_URL}/streams/${streamId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete stream');

      setStreams(streams.filter(s => s.id !== streamId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete stream');
    }
  };

  const filteredStreams = streams
    .filter(stream => {
      const matchesSearch = stream.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stream.url.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
                          (statusFilter === 'active' && stream.is_active) ||
                          (statusFilter === 'inactive' && !stream.is_active);
      return matchesSearch && matchesStatus;
    });

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            RTSP Stream Viewer
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} hover:opacity-80 transition-opacity`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className={`mb-8 rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search streams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                      : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className={`px-4 py-2 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="all">All Streams</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleAddStream}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Stream Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newStreamName}
                  onChange={(e) => setNewStreamName(e.target.value)}
                  className={`mt-1 block w-full rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                />
              </div>
              <div>
                <label htmlFor="url" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  RTSP URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={newStreamUrl}
                  onChange={(e) => setNewStreamUrl(e.target.value)}
                  pattern="rtsp://.*"
                  className={`mt-1 block w-full rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Stream
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative">
              {error}
            </div>
          )}
        </div>

        <StreamGrid
          streams={filteredStreams}
          onStreamToggle={handleStreamToggle}
          onStreamDelete={handleStreamDelete}
        />
      </div>
    </div>
  );
}

export default App;