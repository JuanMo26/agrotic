import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LastUpdatedProps {
  timestamp: string | null;
  onRefresh: () => void;
  isLoading: boolean;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({ timestamp, onRefresh, isLoading }) => {
  // Format the timestamp to a readable format
  const formattedTime = timestamp 
    ? new Date(timestamp).toLocaleTimeString()
    : 'Never';

  return (
    <div className="flex justify-between items-center text-sm text-gray-500 my-2">
      <div>
        Last updated: {formattedTime}
      </div>
      <button 
        onClick={onRefresh} 
        disabled={isLoading}
        className="flex items-center text-blue-500 disabled:text-gray-400"
      >
        <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </button>
    </div>
  );
};

export default LastUpdated;