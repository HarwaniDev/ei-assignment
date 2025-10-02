import { IWeatherObserver } from './observer.interface';
import { IWeatherEvent } from './event.types';
import { Logger } from '../../core/logger/logger';

export class DisplayObserver implements IWeatherObserver {
  private readonly observerName: string;
  private readonly logger: Logger;
  private active: boolean = true;

  constructor(displayName: string) {
    this.observerName = displayName;
    this.logger = Logger.getInstance();
  }

  public update(event: IWeatherEvent): void {
    if (!this.active) {
      return;
    }

    this.logger.info(
      `Display updated with ${event.type}`,
      this.observerName,
      {
        temperature: event.data.temperature,
        humidity: event.data.humidity,
        pressure: event.data.pressure,
        severity: event.severity
      }
    );

    // Simulate display rendering
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📺 ${this.observerName} - Weather Update`);
    console.log(`${'='.repeat(60)}`);
    console.log(`🌡️  Temperature: ${event.data.temperature}°C`);
    console.log(`💧 Humidity: ${event.data.humidity}%`);
    console.log(`🔽 Pressure: ${event.data.pressure} hPa`);
    console.log(`⚠️  Severity: ${event.severity}`);
    console.log(`🕒 Time: ${event.data.timestamp.toLocaleString()}`);
    console.log(`${'='.repeat(60)}\n`);
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
      `Observer ${this.active ? 'activated' : 'deactivated'}`,
      this.observerName
    );
  }
}