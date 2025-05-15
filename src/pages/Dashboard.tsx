import React from 'react';
import { Database } from 'lucide-react';
import ChannelSelector from '../components/ChannelSelector';
import ChannelData from '../components/ChannelData';
import { appConfig } from '../config/appConfig';

function Dashboard() {
  const [selectedChannelId, setSelectedChannelId] = React.useState<string>(
    appConfig.channels[0].id
  );

  const selectedChannel = appConfig.channels.find(
    (channel) => channel.id === selectedChannelId
  );

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center">
            <Database className="h-6 w-6 text-blue-500 mr-2" />
            <h1 className="text-xl font-semibold text-gray-800">AgroTIC</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* <div className="mb-6">
          <ChannelSelector
            channels={appConfig.channels}
            selectedChannelId={selectedChannelId}
            onChannelChange={setSelectedChannelId}
          />
        </div> */}

        {selectedChannel && (
          <ChannelData
            channelConfig={selectedChannel}
            refreshInterval={appConfig.refreshInterval}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;