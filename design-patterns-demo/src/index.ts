import { ApplicationManager } from './core/application-manager';
 

// Behavioral Pattern Demos
import { PaymentProcessor } from './behavioral/strategy/payment-processor';
import { CreditCardPaymentStrategy } from './behavioral/strategy/credit-card-payment.strategy';
import { PayPalPaymentStrategy } from './behavioral/strategy/paypal-payment.strategy';
import { CryptocurrencyPaymentStrategy } from './behavioral/strategy/cryptocurrency-payment.strategy';

import { WeatherStation } from './behavioral/observer/weather-station';
import { DisplayObserver } from './behavioral/observer/display-observer';
import { AlertObserver } from './behavioral/observer/alert-observer';
import { StatisticsObserver } from './behavioral/observer/statistics-observer';

// Creational Pattern Demos
import { NotificationFactory } from './creational/factory/notification-factory';
import { NotificationType, NotificationPriority } from './creational/factory/notification.interface';

import { ReportBuilder } from './creational/builder/report-builder';
import { ReportFormat, ReportSection } from './creational/builder/report.types';

// Structural Pattern Demos
import { LegacyPaymentSystem } from './structural/adapter/legacy-payment.interface';
import { PaymentAdapter } from './structural/adapter/payment-adapter';

import { FileDataSource } from './structural/decorator/data-source.interface';
import { EncryptionDecorator } from './structural/decorator/encryption-decorator';
import { CompressionDecorator } from './structural/decorator/compression-decorator';
import { LoggingDecorator } from './structural/decorator/logging-decorator';

class DesignPatternsDemo {
  private readonly appManager: ApplicationManager;

  // Pattern instances
  private paymentProcessor: PaymentProcessor;
  private weatherStation: WeatherStation;
  private statisticsObserver: StatisticsObserver;

  constructor() {
    this.appManager = ApplicationManager.getInstance();
    this.paymentProcessor = new PaymentProcessor();
    this.weatherStation = new WeatherStation();
    this.statisticsObserver = new StatisticsObserver('WeatherStats');
    
    this.registerMenuItems();
  }

  private registerMenuItems(): void {
    // Behavioral Patterns
    this.appManager.registerMenuItem({
      id: 'strategy-demo',
      label: '💳 Strategy Pattern - Payment Processing System',
      action: () => this.demonstrateStrategyPattern(),
      isEnabled: () => true
    });

    this.appManager.registerMenuItem({
      id: 'observer-demo',
      label: '🌤️  Observer Pattern - Weather Monitoring Station',
      action: () => this.demonstrateObserverPattern(),
      isEnabled: () => true
    });

    // Creational Patterns
    this.appManager.registerMenuItem({
      id: 'factory-demo',
      label: '🏭 Factory Pattern - Notification System',
      action: () => this.demonstrateFactoryPattern(),
      isEnabled: () => true
    });

    this.appManager.registerMenuItem({
      id: 'builder-demo',
      label: '📄 Builder Pattern - Report Generation System',
      action: () => this.demonstrateBuilderPattern(),
      isEnabled: () => true
    });

    // Structural Patterns
    this.appManager.registerMenuItem({
      id: 'adapter-demo',
      label: '🔌 Adapter Pattern - Legacy Payment Integration',
      action: () => this.demonstrateAdapterPattern(),
      isEnabled: () => true
    });

    this.appManager.registerMenuItem({
      id: 'decorator-demo',
      label: '🎨 Decorator Pattern - Enhanced Data Storage',
      action: () => this.demonstrateDecoratorPattern(),
      isEnabled: () => true
    });
  }

  private async demonstrateStrategyPattern(): Promise<void> {
    console.log('\n' + '🔷'.repeat(35));
    console.log('STRATEGY PATTERN DEMONSTRATION');
    console.log('Use Case: E-commerce Payment Processing');
    console.log('🔷'.repeat(35));

    console.log('\n📝 This demo shows how different payment strategies can be');
    console.log('   switched at runtime without changing the payment processor.');

    // Credit Card Payment
    console.log('\n--- Testing Credit Card Payment ---');
    this.paymentProcessor.setStrategy(new CreditCardPaymentStrategy());
    await this.paymentProcessor.executePayment(
      99.99,
      'USD',
      {
        cardNumber: '1234567890123456',
        cvv: '123',
        expiryDate: '12/25'
      }
    );

    await this.delay(1000);

    // PayPal Payment
    console.log('\n--- Testing PayPal Payment ---');
    this.paymentProcessor.setStrategy(new PayPalPaymentStrategy());
    await this.paymentProcessor.executePayment(
      49.99,
      'USD',
      { email: 'user@example.com' }
    );

    await this.delay(1000);

    // Cryptocurrency Payment
    console.log('\n--- Testing Cryptocurrency Payment ---');
    this.paymentProcessor.setStrategy(new CryptocurrencyPaymentStrategy());
    await this.paymentProcessor.executePayment(
      0.005,
      'BTC',
      {
        walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        cryptoType: 'BTC'
      }
    );

    console.log('\n✅ Strategy Pattern demonstrated successfully!');
    console.log('   Different payment methods processed using the same interface.');
    
    await this.waitForUser();
  }

  private async demonstrateObserverPattern(): Promise<void> {
    console.log('\n' + '🔷'.repeat(35));
    console.log('OBSERVER PATTERN DEMONSTRATION');
    console.log('Use Case: Weather Monitoring and Alert System');
    console.log('🔷'.repeat(35));

    console.log('\n📝 This demo shows how multiple observers can subscribe to');
    console.log('   weather data changes and receive automatic updates.');

    // Register observers
    const displayObserver1 = new DisplayObserver('Main Display');
    const displayObserver2 = new DisplayObserver('Mobile Display');
    const alertObserver = new AlertObserver('Emergency Alert System');

    this.weatherStation.registerObserver(displayObserver1);
    this.weatherStation.registerObserver(displayObserver2);
    this.weatherStation.registerObserver(alertObserver);
    this.weatherStation.registerObserver(this.statisticsObserver);

    console.log('\n--- Simulating Weather Updates ---');
    this.weatherStation.updateWeatherData(22, 55, 1010);
    await this.delay(500);
    this.weatherStation.updateWeatherData(41, 60, 1008);
    await this.delay(500);
    this.weatherStation.updateWeatherData(18, 96, 949);

    this.statisticsObserver.displayStatistics();

    console.log('\n--- Deactivating Mobile Display and updating again ---');
    displayObserver2.setActive(false);
    this.weatherStation.updateWeatherData(25, 50, 1013);

    console.log('\n✅ Observer Pattern demonstrated successfully!');
    await this.waitForUser();
  }

  private async demonstrateFactoryPattern(): Promise<void> {
    console.log('\n' + '🔷'.repeat(35));
    console.log('FACTORY PATTERN DEMONSTRATION');
    console.log('Use Case: Multi-channel Notification System');
    console.log('🔷'.repeat(35));

    console.log('\n📝 This demo shows creating different notifications using a single factory.');

    const factory = NotificationFactory.getInstance();

    const email = factory.createNotification(NotificationType.EMAIL);
    await email.send('Welcome to our service!', {
      recipient: 'user@example.com',
      subject: 'Getting Started',
      priority: NotificationPriority.MEDIUM,
      timestamp: new Date()
    });

    await this.delay(500);

    const sms = factory.createNotification(NotificationType.SMS);
    await sms.send('Your verification code is 123456', {
      recipient: '+15555550123',
      priority: NotificationPriority.HIGH,
      timestamp: new Date()
    });

    await this.delay(500);

    const push = factory.createNotification(NotificationType.PUSH);
    await push.send('You have a new message', {
      recipient: 'device-token-abc123',
      priority: NotificationPriority.LOW,
      timestamp: new Date()
    });

    console.log('\n✅ Factory Pattern demonstrated successfully!');
    await this.waitForUser();
  }

  private async demonstrateBuilderPattern(): Promise<void> {
    console.log('\n' + '🔷'.repeat(35));
    console.log('BUILDER PATTERN DEMONSTRATION');
    console.log('Use Case: Flexible Report Generation');
    console.log('🔷'.repeat(35));

    console.log('\n📝 This demo builds a report step-by-step and then generates it.');

    const builder = new ReportBuilder()
      .setTitle('Quarterly Sales Report')
      .setAuthor('Analytics Team')
      .setDepartment('Sales')
      .setConfidential(true)
      .setFormat(ReportFormat.HTML)
      .addSection(ReportSection.HEADER, 'Company XYZ - Q3 Performance')
      .addSection(ReportSection.SUMMARY, 'Overall sales increased by 12% QoQ.')
      .addSection(ReportSection.DETAILS, 'Regional breakdown and product line performance included.')
      .addSection(ReportSection.CHARTS, 'Revenue vs. Target chart, Units sold histogram')
      .addSection(ReportSection.FOOTER, 'Prepared by Analytics Team')
      .addData('totalRevenue', 1250000)
      .addData('topProduct', 'UltraWidget Pro')
      .addChart('Revenue by Region - Bar Chart');

    const report = builder.build();
    const output = await report.generate();

    console.log('\n--- Generated Report Output ---');
    console.log(output);
    console.log('\n✅ Builder Pattern demonstrated successfully!');
    await this.waitForUser();
  }

  private async demonstrateAdapterPattern(): Promise<void> {
    console.log('\n' + '🔷'.repeat(35));
    console.log('ADAPTER PATTERN DEMONSTRATION');
    console.log('Use Case: Integrate Legacy Payment with Modern Gateway');
    console.log('🔷'.repeat(35));

    console.log('\n📝 This demo adapts a legacy payment system to a modern interface.');

    const legacy = new LegacyPaymentSystem();
    const gateway = new PaymentAdapter(legacy);

    const accountId = 'ACC-1001';

    const info = await gateway.getAccountInfo(accountId);
    console.log(`\nAccount ${info.accountId} balance: ${info.balance} ${info.currency}`);

    try {
      const response = await gateway.processPayment(accountId, 49.99, 'USD');
      console.log(`\nPayment ${response.success ? 'OK' : 'FAILED'} - Tx: ${response.transactionId}`);
    } catch (err) {
      console.log(`\n❌ Payment error: ${(err as Error).message}`);
    }

    console.log('\n✅ Adapter Pattern demonstrated successfully!');
    await this.waitForUser();
  }

  private async demonstrateDecoratorPattern(): Promise<void> {
    console.log('\n' + '🔷'.repeat(35));
    console.log('DECORATOR PATTERN DEMONSTRATION');
    console.log('Use Case: Encrypted, Compressed, and Logged Data Storage');
    console.log('🔷'.repeat(35));

    console.log('\n📝 This demo composes decorators around a file-like data source.');

    const rawSource = new FileDataSource('report.data');
    const encrypted = new EncryptionDecorator(rawSource, 's3cr3t-key');
    const compressed = new CompressionDecorator(encrypted);
    const logged = new LoggingDecorator(compressed);

    const originalData = 'Sensitive report contents: Revenue=1,250,000; Growth=12%';
    console.log(`\nOriginal Data: ${originalData}`);

    logged.writeData(originalData);

    const readBack = logged.readData();
    console.log(`Read Back Data: ${readBack}`);
    console.log(`DataSource Type: ${logged.getDataSourceType()}`);

    console.log('\n✅ Decorator Pattern demonstrated successfully!');
    await this.waitForUser();
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async waitForUser(): Promise<void> {
    console.log('\n(Press Enter to return to the main menu)');
    await this.delay(600);
  }
}

// Bootstrap application
(() => {
  new DesignPatternsDemo();
  ApplicationManager.getInstance().start();
})();