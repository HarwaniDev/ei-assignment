import { IWeatherSubject, IWeatherObserver } from './observer.interface';
import { IWeatherData, IWeatherEvent, EventType } from './event.types';
import { Logger } from '../../core/logger/logger';
import { Validator } from '../../core/validation/validator';

export class WeatherStation implements IWeatherSubject {
  private readonly observers: Set<IWeatherObserver>;
  private readonly logger: Logger;
  private currentData: IWeatherData;
  private readonly thresholds = {
    temperatureMax: 40,
    temperatureMin: -10,
    humidityMax: 95,
    pressureMin: 950,
    pressureMax: 1050
  };

  constructor() {
    this.observers = new Set();
    this.logger = Logger.getInstance();
    this.currentData = {
      temperature: 20,
      humidity: 50,
      pressure: 1013,
      timestamp: new Date()
    };
  }

  public registerObserver(observer: IWeatherObserver): void {
    if (this.observers.has(observer)) {
      this.logger.warn(
        `Observer ${observer.getObserverName()} is already registered`,
        'WeatherStation'
      );
      return;
    }

    this.observers.add(observer);
    this.logger.info(
      `Observer registered: ${observer.getObserverName()}`,
      'WeatherStation',
      { totalObservers: this.observers.size }
    );
  }

  public removeObserver(observer: IWeatherObserver): void {
    if (this.observers.delete(observer)) {
      this.logger.info(
        `Observer removed: ${observer.getObserverName()}`,
        'WeatherStation',
        { totalObservers: this.observers.size }
      );
    }
  }

  public notifyObservers(event: IWeatherEvent): void {
    const activeObservers = Array.from(this.observers).filter(obs => obs.isActive());
    
    this.logger.debug(
      `Notifying ${activeObservers.length} active observers`,
      'WeatherStation',
      { eventType: event.type, severity: event.severity }
    );

    activeObservers.forEach(observer => {
      try {
        observer.update(event);
      } catch (error) {
        this.logger.error(
          `Error notifying observer ${observer.getObserverName()}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          'WeatherStation'
        );
      }
    });
  }

  public updateWeatherData(temperature: number, humidity: number, pressure: number): void {
    // Validate inputs
    const tempValidation = Validator.validateNumericRange(temperature, 'Temperature', -50, 60);
    const humidityValidation = Validator.validateNumericRange(humidity, 'Humidity', 0, 100);
    const pressureValidation = Validator.validateNumericRange(pressure, 'Pressure', 900, 1100);

    const combined = Validator.combineValidationResults(
      tempValidation,
      humidityValidation,
      pressureValidation
    );

    Validator.throwIfInvalid(combined, 'WeatherStation.updateWeatherData');

    this.currentData = {
      temperature,
      humidity,
      pressure,
      timestamp: new Date()
    };

    this.logger.info(
      'Weather data updated',
      'WeatherStation',
      { temperature, humidity, pressure }
    );

    // Determine event type and severity
    this.processWeatherChange();
  }

  private processWeatherChange(): void {
    const events: IWeatherEvent[] = [];

    // Temperature events
    if (this.currentData.temperature !== this.currentData.temperature) {
      events.push(this.createEvent(EventType.TEMPERATURE_CHANGED, 'LOW'));
    }

    if (
      this.currentData.temperature >= this.thresholds.temperatureMax ||
      this.currentData.temperature <= this.thresholds.temperatureMin
    ) {
      events.push(this.createEvent(EventType.CRITICAL_THRESHOLD, 'CRITICAL'));
    }

    // Humidity events
    if (this.currentData.humidity >= this.thresholds.humidityMax) {
      events.push(this.createEvent(EventType.HUMIDITY_CHANGED, 'HIGH'));
    }

    // Pressure events
    if (
      this.currentData.pressure <= this.thresholds.pressureMin ||
      this.currentData.pressure >= this.thresholds.pressureMax
    ) {
      events.push(this.createEvent(EventType.PRESSURE_CHANGED, 'MEDIUM'));
    }

    // Always send at least one event
    if (events.length === 0) {
      events.push(this.createEvent(EventType.TEMPERATURE_CHANGED, 'LOW'));
    }

    events.forEach(event => this.notifyObservers(event));
  }

  private createEvent(
    type: EventType,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ): IWeatherEvent {
    return {
      type,
      data: { ...this.currentData },
      severity
    };
  }

  public getCurrentData(): IWeatherData {
    return { ...this.currentData };
  }

  public getObserverCount(): number {
    return this.observers.size;
  }
}