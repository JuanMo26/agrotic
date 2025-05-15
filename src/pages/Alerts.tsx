import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { Alert } from '../types/thingspeak';

function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('thingspeak-alerts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('thingspeak-alerts', JSON.stringify(alerts));
  }, [alerts]);

  const markAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Alerts</h2>
        {alerts.length > 0 && (
          <button
            onClick={clearAlerts}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Clear All
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No alerts to display</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                alert.type === 'high' ? 'border-red-500' : 'border-blue-500'
              } ${!alert.read ? 'bg-blue-50' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{alert.fieldName}</h3>
                  <p className="text-sm text-gray-600">
                    {alert.type === 'high' ? 'Above' : 'Below'} threshold: {alert.threshold}
                  </p>
                  <p className="text-sm text-gray-500">
                    Value: {alert.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                {!alert.read && (
                  <button
                    onClick={() => markAsRead(alert.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Alerts;