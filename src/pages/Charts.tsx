import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchChannelData } from '../services/thingSpeakApi';
import { appConfig } from '../config/appConfig';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const timeRanges = [
  { label: '1 Hora', value: 60 },
  { label: '1 Día', value: 1440 },
  { label: '1 Semana', value: 10080 }
];

function Charts() {
  const [selectedRange, setSelectedRange] = useState(timeRanges[0].value);
  const [data, setData] = useState<any[]>([]);
  const [fieldNames, setFieldNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channel = appConfig.channels[0];

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchChannelData(channel.id, channel.apiKey, selectedRange);

        // Map field names from the channel object
        const mappedFieldNames: Record<string, string> = {};
        Object.keys(response.channel).forEach((key) => {
          if (key.startsWith('field')) {
            mappedFieldNames[key] = response.channel[key] as string;
          }
        });
        setFieldNames(mappedFieldNames);

        // Format data for the chart
        const formattedData = response.feeds.map(feed => ({
          timestamp: new Date(feed.created_at).toLocaleString(),
          ...Object.keys(mappedFieldNames).reduce((acc, fieldKey) => ({
            ...acc,
            [mappedFieldNames[fieldKey]]: parseFloat(feed[fieldKey] as string || '0')
          }), {})
        }));
        setData(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [selectedRange, channel.id, channel.apiKey]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Historial de Datos</h2>
      
      <div className="mb-4">
        <select
          value={selectedRange}
          onChange={(e) => setSelectedRange(Number(e.target.value))}
          className="w-full p-2 border rounded-lg"
        >
          {timeRanges.map(range => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {Object.keys(fieldNames).map((fieldKey) => (
        <div key={fieldKey} className="mb-8 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">{fieldNames[fieldKey]}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={fieldNames[fieldKey]}
                  stroke={channel.fields.find(f => f.id === fieldKey)?.color || '#000'}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Charts;