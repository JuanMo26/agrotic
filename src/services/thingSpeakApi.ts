import { ThingSpeakResponse } from '../types/thingspeak';

/**
 * Fetches data from a ThingSpeak channel
 * @param channelId The ThingSpeak channel ID
 * @param apiKey The ThingSpeak API key
 * @param results Number of results to fetch (default: 10)
 * @returns Promise with ThingSpeak response data
 */
export const fetchChannelData = async (
  channelId: string, 
  apiKey: string, 
  results: number = 10
): Promise<ThingSpeakResponse> => {
  const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=${results}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching ThingSpeak data:', error);
    throw error;
  }
};