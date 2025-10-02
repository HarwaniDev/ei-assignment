import { IDataSource } from './data-source.interface';

export abstract class DataSourceDecorator implements IDataSource {
  protected wrappee: IDataSource;

  constructor(source: IDataSource) {
    this.wrappee = source;
  }

  public writeData(data: string): void {
    this.wrappee.writeData(data);
  }

  public readData(): string {
    return this.wrappee.readData();
  }

  public getDataSourceType(): string {
    return this.wrappee.getDataSourceType();
  }
}