import { DataSourceDecorator } from './data-source-decorator';
import { IDataSource } from './data-source.interface';
import { Logger } from '../../core/logger/logger';
import * as zlib from 'zlib';
import { promisify } from 'util';

const deflate = promisify(zlib.deflate);
const inflate = promisify(zlib.inflate);

export class CompressionDecorator extends DataSourceDecorator {
  private readonly logger: Logger;

  constructor(source: IDataSource) {
    super(source);
    this.logger = Logger.getInstance();
  }

  public writeData(data: string): void {
    this.logger.info(
      `Compressing data before writing`,
      'CompressionDecorator',
      { originalSize: data.length }
    );

    const compressed = this.compress(data);
    
    this.logger.info(
      `Data compressed`,
      'CompressionDecorator',
      {
        originalSize: data.length,
        compressedSize: compressed.length,
        ratio: ((1 - compressed.length / data.length) * 100).toFixed(2) + '%'
      }
    );

    super.writeData(compressed);
  }

  public readData(): string {
    const compressed = super.readData();
    
    this.logger.info(
      `Decompressing data after reading`,
      'CompressionDecorator',
      { compressedSize: compressed.length }
    );

    const decompressed = this.decompress(compressed);
    
    this.logger.info(
      `Data decompressed`,
      'CompressionDecorator',
      { decompressedSize: decompressed.length }
    );

    return decompressed;
  }

  private compress(data: string): string {
    // Simple run-length encoding for demonstration
    let compressed = '';
    let count = 1;
    
    for (let i = 0; i < data.length; i++) {
      if (i + 1 < data.length && data[i] === data[i + 1]) {
        count++;
      } else {
        if (count > 1) {
          compressed += `${count}${data[i]}`;
        } else {
          compressed += data[i];
        }
        count = 1;
      }
    }
    
    return compressed;
  }

  private decompress(compressed: string): string {
    let decompressed = '';
    let i = 0;
    
    while (i < compressed.length) {
      if (/\d/.test(compressed[i])) {
        let numStr = '';
        while (i < compressed.length && /\d/.test(compressed[i])) {
          numStr += compressed[i];
          i++;
        }
        const count = parseInt(numStr, 10);
        const char = compressed[i];
        decompressed += char.repeat(count);
        i++;
      } else {
        decompressed += compressed[i];
        i++;
      }
    }
    
    return decompressed;
  }

  public getDataSourceType(): string {
    return `Compressed(${super.getDataSourceType()})`;
  }
}