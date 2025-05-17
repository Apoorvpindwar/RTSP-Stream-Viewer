import React from 'react';
import StreamCard from './StreamCard';
import { Stream } from '../types/stream';

interface StreamGridProps {
  streams: Stream[];
  onStreamToggle: (id: number) => void;
  onStreamDelete: (id: number) => void;
}

const StreamGrid: React.FC<StreamGridProps> = ({ 
  streams, 
  onStreamToggle, 
  onStreamDelete 
}) => {
  // Determine grid columns based on number of streams
  const getGridClass = () => {
    if (streams.length === 0) return '';
    if (streams.length === 1) return 'grid-cols-1';
    if (streams.length === 2) return 'grid-cols-1 md:grid-cols-2';
    if (streams.length === 3 || streams.length === 4) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <div className={`grid gap-4 ${getGridClass()}`}>
      {streams.length === 0 ? (
        <div className="col-span-full p-8 text-center bg-gray-800 rounded-lg">
          <p className="text-gray-300">No streams added yet. Add a stream to get started.</p>
        </div>
      ) : (
        streams.map((stream) => (
          <StreamCard
            key={stream.id}
            stream={stream}
            onTogglePlay={() => onStreamToggle(stream.id)}
            onRemoveStream={() => onStreamDelete(stream.id)}
          />
        ))
      )}
    </div>
  );
};

export default StreamGrid;