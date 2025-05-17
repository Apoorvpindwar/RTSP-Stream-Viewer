import React from 'react';
import { Video } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 py-4 px-6 mb-6 shadow-md">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center">
          <Video className="text-teal-500 mr-3" size={28} />
          <h1 className="text-xl font-bold text-white">RTSP Stream Viewer</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;