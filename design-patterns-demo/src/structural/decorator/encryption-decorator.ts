import { DataSourceDecorator } from './data-source-decorator';
import { IDataSource } from './data-source.interface';
import { Logger } from '../../core/logger/logger';

export class EncryptionDecorator extends DataSourceDecorator {
  private readonly logger: Logger;
  private readonly encryptionKey: string;

  constructor(source: IDataSource, encryptionKey: string = 'default-key-123') {
    super(source);
    this.logger = Logger.getInstance();
    this.encryptionKey = encryptionKey;
  }

  public writeData(data: string): void {
    this.logger.info(
      `Encrypting data before writing`,
      'EncryptionDecorator',
      { dataLength: data.length }
    );

    const encrypted = this.encrypt(data);
    super.writeData(encrypted);
  }

  public readData(): string {
    const encrypted = super.readData();
    
    this.logger.info(
      `Decrypting data after reading`,
      'EncryptionDecorator',
      { encryptedLength: encrypted.length }
    );

    return this.decrypt(encrypted);
  }

  private encrypt(data: string): string {
    // Simple XOR encryption for demonstration
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
      encrypted += String.fromCharCode(charCode);
    }
    
    // Base64 encode to make it printable
    return Buffer.from(encrypted).toString('base64');
  }

  private decrypt(encryptedData: string): string {
    // Base64 decode
    const encrypted = Buffer.from(encryptedData, 'base64').toString();
    
    // Simple XOR decryption
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    return decrypted;
  }

  public getDataSourceType(): string {
    return `Encrypted(${super.getDataSourceType()})`;
  }
}