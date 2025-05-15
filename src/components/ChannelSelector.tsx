import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ChannelConfig } from '../types/thingspeak';

interface ChannelSelectorProps {
  channels: ChannelConfig[];
  selectedChannelId: string;
  onChannelChange: (channelId: string) => void;
}

const ChannelSelector: React.FC<ChannelSelectorProps> = ({ 
  channels, 
  selectedChannelId, 
  onChannelChange 
}) => {
  return (
    <div className="relative">
      <select
        value={selectedChannelId}
        onChange={(e) => onChannelChange(e.target.value)}
        className="block w-full px-4 py-2 pr-8 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
      >
        {channels.map((channel) => (
          <option key={channel.id} value={channel.id}>
            {channel.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
};

export default ChannelSelector;