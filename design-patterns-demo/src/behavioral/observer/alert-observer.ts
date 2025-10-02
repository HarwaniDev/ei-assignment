import { IWeatherObserver } from './observer.interface';
import { IWeatherEvent } from './event.types';
import { Logger } from '../../core/logger/logger';

export class AlertObserver implements IWeatherObserver {
  private readonly observerName: string;
  private readonly logger: Logger;
  private active: boolean = true;
  private alertCount: number = 0;

  constructor(alertSystemName: string) {
    this.observerName = alertSystemName;
    this.logger = Logger.getInstance();
  }

  public update(event: IWeatherEvent): void {
    if (!this.active) {
      return;
    }

    // Only alert on critical events
    if (event.severity === 'CRITICAL' || event.severity === 'HIGH') {
      this.alertCount++;
      this.sendAlert(event);
    }
  }

  private sendAlert(event: IWeatherEvent): void {
    this.logger.warn(
      `ALERT: Critical weather condition detected`,
      this.observerName,
      {
        eventType: event.type,
        severity: event.severity,
        temperature: event.data.temperature,
        alertNumber: this.alertCount
      }
    );

    console.log(`\n${'⚠️ '.repeat(20)}`);
    console.log(`🚨 WEATHER ALERT #${this.alertCount} - ${this.observerName} 🚨`);
    console.log(`Event Type: ${event.type}`);
    console.log(`Severity Level: ${event.severity}`);
    console.log(`Temperature: ${event.data.temperature}°C`);
    console.log(`Humidity: ${event.data.humidity}%`);
    console.log(`Pressure: ${event.data.pressure} hPa`);
    console.log(`Time: ${event.data.timestamp.toLocaleString()}`);
    console.log(`${'⚠️ '.repeat(20)}\n`);
  }

  public getObserverName(): string {
    return this.observerName;
  }

  public isActive(): boolean {
    return this.active;
  }

  public setActive(active: boolean): void {
    this.active = active;
    this.logger.info(
      `Alert system ${this.active ? 'activated' : 'deactivated'}`,
      this.observerName
    );
  }

  public getAlertCount(): number {
    return this.alertCount;
  }
}