import { IWeatherEvent } from './event.types';

export interface IWeatherObserver {
  update(event: IWeatherEvent): void;
  getObserverName(): string;
  isActive(): boolean;
}

export interface IWeatherSubject {
  registerObserver(observer: IWeatherObserver): void;
  removeObserver(observer: IWeatherObserver): void;
  notifyObservers(event: IWeatherEvent): void;
}