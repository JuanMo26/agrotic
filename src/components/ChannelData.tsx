import React, { useState, useEffect, useCallback } from 'react';
import { fetchChannelData } from '../services/thingSpeakApi';
import { ChannelConfig, Feed } from '../types/thingspeak';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import DataCard from './DataCard';
import LastUpdated from './LastUpdated';

interface ChannelDataProps {
  channelConfig: ChannelConfig;
  refreshInterval: number;
}

const ChannelData: React.FC<ChannelDataProps> = ({ channelConfig, refreshInterval }: ChannelDataProps) => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [fieldNames, setFieldNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchChannelData(channelConfig.id, channelConfig.apiKey, 2); // Get 2 results for trend comparison
      setFeeds(response.feeds);

      // Map field names from the channel object
      const channel = response.channel;
      const mappedFieldNames: Record<string, string> = {};
      Object.keys(channel).forEach((key) => {
        if (key.startsWith('field')) {
          mappedFieldNames[key] = channel[key] as string; // TypeScript ya no mostrará error
        }
      });
      setFieldNames(mappedFieldNames);

      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [channelConfig.id, channelConfig.apiKey]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up auto-refresh interval
  useEffect(() => {
    const intervalId = setInterval(fetchData, refreshInterval);
    
    // Clean up interval on unmount or when channel changes
    return () => clearInterval(intervalId);
  }, [fetchData, refreshInterval]);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchData();
  };

  if (isLoading && feeds.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && feeds.length === 0) {
    return <ErrorMessage message={error} retry={fetchData} />;
  }

  // Get the latest feed data
  const latestFeed = feeds.length > 0 ? feeds[0] : null;
  const previousFeed = feeds.length > 1 ? feeds[1] : null;

  return (
    <div className="animate-fadeIn">
      <LastUpdated 
        timestamp={lastUpdated} 
        onRefresh={handleRefresh} 
        isLoading={isLoading} 
      />
      
      {error && <ErrorMessage message={error} />}
      
      <div className="mt-4">
        {Object.keys(fieldNames).map((fieldKey) => (
          <DataCard
            key={fieldKey}
            field={{ id: fieldKey, name: fieldNames[fieldKey] }}
            currentValue={latestFeed ? latestFeed[fieldKey as keyof Feed] as string : undefined}
            previousValue={previousFeed ? previousFeed[fieldKey as keyof Feed] as string : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default ChannelData;