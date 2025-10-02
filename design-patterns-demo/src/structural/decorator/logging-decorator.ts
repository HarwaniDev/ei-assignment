import { DataSourceDecorator } from './data-source-decorator';
import { IDataSource } from './data-source.interface';
import { Logger } from '../../core/logger/logger';

export class LoggingDecorator extends DataSourceDecorator {
  private readonly logger: Logger;

  constructor(source: IDataSource) {
    super(source);
    this.logger = Logger.getInstance();
  }

  public writeData(data: string): void {
    this.logger.info(
      `Logging write operation`,
      'LoggingDecorator',
      {
        dataLength: data.length,
        timestamp: new Date().toISOString(),
        dataPreview: data.substring(0, 50) + (data.length > 50 ? '...' : '')
      }
    );

    super.writeData(data);

    this.logger.info(
      `Write operation completed`,
      'LoggingDecorator'
    );
  }

  public readData(): string {
    this.logger.info(
      `Logging read operation`,
      'LoggingDecorator',
      { timestamp: new Date().toISOString() }
    );

    const data = super.readData();

    this.logger.info(
      `Read operation completed`,
      'LoggingDecorator',
      {
        dataLength: data.length,
        dataPreview: data.substring(0, 50) + (data.length > 50 ? '...' : '')
      }
    );

    return data;
  }

  public getDataSourceType(): string {
    return `Logged(${super.getDataSourceType()})`;
  }
}