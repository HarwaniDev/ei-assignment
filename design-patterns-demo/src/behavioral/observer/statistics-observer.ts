import { IWeatherObserver } from './observer.interface';
import { IWeatherEvent } from './event.types';
import { Logger } from '../../core/logger/logger';

export class StatisticsObserver implements IWeatherObserver {
  private readonly observerName: string;
  private readonly logger: Logger;
  private active: boolean = true;
  private temperatureSum: number = 0;
  private humiditySum: number = 0;
  private pressureSum: number = 0;
  private readingCount: number = 0;

  constructor(statsSystemName: string) {
    this.observerName = statsSystemName;
    this.logger = Logger.getInstance();
  }

  public update(event: IWeatherEvent): void {
    if (!this.active) {
      return;
    }

    this.temperatureSum += event.data.temperature;
    this.humiditySum += event.data.humidity;
    this.pressureSum += event.data.pressure;
    this.readingCount++;

    this.logger.debug(
      `Statistics updated`,
      this.observerName,
      {
        totalReadings: this.readingCount,
        avgTemperature: this.getAverageTemperature(),
        avgHumidity: this.getAverageHumidity(),
        avgPressure: this.getAveragePressure()
      }
    );
  }

  public getAverageTemperature(): number {
    return this.readingCount > 0 ? this.temperatureSum / this.readingCount : 0;
  }

  public getAverageHumidity(): number {
    return this.readingCount > 0 ? this.humiditySum / this.readingCount : 0;
  }

  public getAveragePressure(): number {
    return this.readingCount > 0 ? this.pressureSum / this.readingCount : 0;
  }

  public displayStatistics(): void {
    console.log(`\n${'📊 '.repeat(20)}`);
    console.log(`📈 Weather Statistics - ${this.observerName}`);
    console.log(`${'─'.repeat(60)}`);
    console.log(`Total Readings: ${this.readingCount}`);
    console.log(`Average Temperature: ${this.getAverageTemperature().toFixed(2)}°C`);
    console.log(`Average Humidity: ${this.getAverageHumidity().toFixed(2)}%`);
    console.log(`Average Pressure: ${this.getAveragePressure().toFixed(2)} hPa`);
    console.log(`${'📊 '.repeat(20)}\n`);
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
      `Statistics system ${this.active ? 'activated' : 'deactivated'}`,
      this.observerName
    );
  }

  public getReadingCount(): number {
    return this.readingCount;
  }
}