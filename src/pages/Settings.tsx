import React, { useState, useEffect } from 'react';
import { appConfig } from '../config/appConfig';
import { fetchChannelData } from '../services/thingSpeakApi';

function Settings() {
  const [thresholds, setThresholds] = useState<Record<string, { min: number; max: number }>>({});
  const [fieldNames, setFieldNames] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const channel = appConfig.channels[0];

  useEffect(() => {
    const fetchFieldNames = async () => {
      try {
        const response = await fetchChannelData(channel.id, channel.apiKey);
        const mappedFieldNames: Record<string, string> = {};
        Object.keys(response.channel).forEach((key) => {
          if (key.startsWith('field')) {
            mappedFieldNames[key] = response.channel[key] as string;
          }
        });
        setFieldNames(mappedFieldNames);

        // Initialize thresholds with default values
        const initialThresholds = Object.keys(mappedFieldNames).reduce((acc, fieldKey) => {
          const fieldConfig = channel.fields.find((f) => f.id === fieldKey);
          return {
            ...acc,
            [fieldKey]: {
              min: fieldConfig?.minThreshold || 0,
              max: fieldConfig?.maxThreshold || 100,
            },
          };
        }, {});
        setThresholds(initialThresholds);
      } catch (err) {
        setError('Failed to fetch field names');
      }
    };

    fetchFieldNames();
  }, [channel.id, channel.apiKey, channel.fields]);

  useEffect(() => {
    localStorage.setItem('thingspeak-thresholds', JSON.stringify(thresholds));
  }, [thresholds]);

  const handleThresholdChange = (fieldId: string, type: 'min' | 'max', value: string) => {
    setThresholds((prev) => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        [type]: Number(value),
      },
    }));
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Configuración</h2>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Umbrales de Alertas</h3>
          <p className="text-sm text-gray-500">Establezca valores mínimos y máximos, según su cultivo</p>
        </div>

        <div className="p-4 space-y-4">
          {Object.keys(fieldNames).map((fieldKey) => (
            <div key={fieldKey} className="space-y-2">
              <h4 className="font-medium">{fieldNames[fieldKey]}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Mínimo {channel.fields.find((f) => f.id === fieldKey)?.unit || ''}
                  </label>
                  <input
                    type="number"
                    value={thresholds[fieldKey]?.min || ''}
                    onChange={(e) => handleThresholdChange(fieldKey, 'min', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Máximo {channel.fields.find((f) => f.id === fieldKey)?.unit || ''}
                  </label>
                  <input
                    type="number"
                    value={thresholds[fieldKey]?.max || ''}
                    onChange={(e) => handleThresholdChange(fieldKey, 'max', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;