export interface IDataSource {
    writeData(data: string): void;
    readData(): string;
    getDataSourceType(): string;
  }
  
  export class FileDataSource implements IDataSource {
    private readonly filename: string;
    private data: string = '';
  
    constructor(filename: string) {
      this.filename = filename;
    }
  
    public writeData(data: string): void {
      console.log(`[FileDataSource] Writing data to ${this.filename}`);
      this.data = data;
    }
  
    public readData(): string {
      console.log(`[FileDataSource] Reading data from ${this.filename}`);
      return this.data;
    }
  
    public getDataSourceType(): string {
      return 'File';
    }
  
    public getFilename(): string {
      return this.filename;
    }
  }