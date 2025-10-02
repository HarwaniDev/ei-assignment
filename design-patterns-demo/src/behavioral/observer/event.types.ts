export enum EventType {
    TEMPERATURE_CHANGED = 'TEMPERATURE_CHANGED',
    HUMIDITY_CHANGED = 'HUMIDITY_CHANGED',
    PRESSURE_CHANGED = 'PRESSURE_CHANGED',
    CRITICAL_THRESHOLD = 'CRITICAL_THRESHOLD',
    SYSTEM_ALERT = 'SYSTEM_ALERT'
  }
  
  export interface IWeatherData {
    temperature: number;
    humidity: number;
    pressure: number;
    timestamp: Date;
  }
  
  export interface IWeatherEvent {
    type: EventType;
    data: IWeatherData;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }