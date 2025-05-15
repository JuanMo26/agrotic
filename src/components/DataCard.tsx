import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Feed, FieldConfig } from '../types/thingspeak';

interface DataCardProps {
  field: FieldConfig;
  currentValue: string | undefined;
  previousValue: string | undefined;
}

const DataCard: React.FC<DataCardProps> = ({ field, currentValue, previousValue }) => {
  // If values are undefined or not numeric, display them as is
  if (!currentValue) return null;
  
  // Try to parse values as numbers for comparison
  const current = parseFloat(currentValue);
  const previous = previousValue ? parseFloat(previousValue) : undefined;
  
  // Calculate trend
  let trend = null;
  let trendColor = 'text-gray-400';
  
  if (!isNaN(current) && previous !== undefined && !isNaN(previous)) {
    if (current > previous) {
      trend = <ArrowUp className="h-4 w-4 text-red-500" />;
      trendColor = 'text-red-500';
    } else if (current < previous) {
      trend = <ArrowDown className="h-4 w-4 text-green-500" />;
      trendColor = 'text-green-500';
    } else {
      trend = <Minus className="h-4 w-4 text-gray-400" />;
    }
  }
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4"
      style={{ borderLeftColor: field.color || '#3498db' }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{field.name}</h3>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold">
              {!isNaN(current) ? current.toFixed(2) : currentValue}
            </p>
            {field.unit && <span className="ml-1 text-gray-500 text-sm">{field.unit}</span>}
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          {trend && (
            <div className="flex items-center">
              {trend}
              {previous !== undefined && !isNaN(previous) && (
                <span className={`text-xs ml-1 ${trendColor}`}>
                  {Math.abs(current - previous).toFixed(2)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataCard;