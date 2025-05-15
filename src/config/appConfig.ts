import { ChannelConfig } from '../types/thingspeak';

export const appConfig = {
  channels: [
    {
      id: '2889182',
      name: 'ThingSpeak Channel',
      apiKey: 'EOCLG0TND6IHD6KU',
      fields: [
        { 
          id: 'field1', 
          name: 'Temperatura', 
          unit: '°C',
          color: '#f39c12',
          minThreshold: 15,
          maxThreshold: 30
        },
        { 
          id: 'field2', 
          name: 'Humedad', 
          unit: '%',
          color: '#3498db',
          minThreshold: 30,
          maxThreshold: 70
        },
        { 
          id: 'field3', 
          name: 'TDS', 
          unit: 'ppm',
          color: '#1abc9c',
          minThreshold: 980,
          maxThreshold: 1020
        },
        { 
          id: 'field4', 
          name: 'pH', 
          unit: 'pH',
          color: '#e74c3c',
          minThreshold: 0,
          maxThreshold: 1000
        }
      ]
    }
  ],
  refreshInterval: 300000 // 5 minutes
};