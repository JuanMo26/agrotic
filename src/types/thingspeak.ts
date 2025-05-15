export interface Feed {
  created_at: string;
  entry_id: number;
  [key: string]: string | number | undefined; // Permite propiedades dinámicas como field1, field2, etc.
}

export interface FieldConfig {
  id: string;
  name: string;
  unit?: string;
  color?: string;
  minThreshold?: number;
  maxThreshold?: number;
}

export interface ChannelConfig {
  id: string;
  name: string;
  apiKey: string;
  fields: FieldConfig[];
}

export interface Channel {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  [key: string]: string | number; // Permite propiedades dinámicas como field1, field2, etc.
}

export interface ThingSpeakResponse {
  channel: Channel;
  feeds: Feed[];
}

export interface Alert {
  id: string;
  fieldId: string;
  fieldName: string;
  value: number;
  threshold: number;
  type: 'high' | 'low';
  timestamp: string;
  read: boolean;
}