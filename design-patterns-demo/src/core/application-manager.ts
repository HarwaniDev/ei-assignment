import * as readline from 'readline';
import { Logger } from './logger/logger';
import { ErrorHandler } from './error-handler/error-handler';
import { ApplicationState, IMenuItem } from '../types/common.types';

export class ApplicationManager {
  private static instance: ApplicationManager;
  private readonly logger: Logger;
  private readonly errorHandler: ErrorHandler;
  private applicationState: ApplicationState;
  private readonly rl: readline.Interface;
  private readonly menuItems: IMenuItem[];

  private constructor() {
    this.logger = Logger.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
    this.applicationState = ApplicationState.INITIALIZING;
    this.menuItems = [];

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.setupSignalHandlers();
  }

  public static getInstance(): ApplicationManager {
    if (!ApplicationManager.instance) {
      ApplicationManager.instance = new ApplicationManager();
    }
    return ApplicationManager.instance;
  }

  public registerMenuItem(item: IMenuItem): void {
    this.menuItems.push(item);
    this.logger.debug(`Menu item registered: ${item.label}`, 'ApplicationManager');
  }

  public async start(): Promise<void> {
    this.logger.info('Application starting...', 'ApplicationManager');
    this.applicationState = ApplicationState.RUNNING;

    try {
      await this.runMainLoop();
    } catch (error) {
      this.errorHandler.handleError(error as Error, 'ApplicationManager.start');
    } finally {
      await this.shutdown();
    }
  }

  private async runMainLoop(): Promise<void> {
    while (this.applicationState === ApplicationState.RUNNING) {
      try {
        this.displayMenu();
        const choice = await this.getUserInput('\nEnter your choice: ');

        if (choice.toLowerCase() === 'exit' || choice.toLowerCase() === 'quit') {
          this.logger.info('User initiated shutdown', 'ApplicationManager');
          break;
        }

        await this.handleMenuChoice(choice);
      } catch (error) {
        this.errorHandler.handleError(error as Error, 'ApplicationManager.runMainLoop');
        
        // Ask if user wants to continue
        const continueChoice = await this.getUserInput('\nContinue? (yes/no): ');
        if (continueChoice.toLowerCase() !== 'yes' && continueChoice.toLowerCase() !== 'y') {
          break;
        }
      }
    }
  }

  private displayMenu(): void {
    console.log('\n' + '='.repeat(70));
    console.log('🎯 DESIGN PATTERNS DEMONSTRATION SYSTEM');
    console.log('='.repeat(70));

    this.menuItems.forEach((item, index) => {
      const status = item.isEnabled() ? '✓' : '✗';
      console.log(`${index + 1}. [${status}] ${item.label}`);
    });

    console.log(`\n0. Exit Application`);
    console.log('='.repeat(70));
  }

  private async handleMenuChoice(choice: string): Promise<void> {
    const index = parseInt(choice, 10) - 1;

    if (isNaN(index) || index < 0 || index >= this.menuItems.length) {
      console.log('\n❌ Invalid choice. Please try again.');
      return;
    }

    const menuItem = this.menuItems[index];

    if (!menuItem.isEnabled()) {
      console.log(`\n⚠️  ${menuItem.label} is currently disabled.`);
      return;
    }

    this.logger.info(`Executing menu action: ${menuItem.label}`, 'ApplicationManager');
    
    try {
      await menuItem.action();
    } catch (error) {
      this.errorHandler.handleError(error as Error, `ApplicationManager.${menuItem.id}`);
      console.log('\n❌ An error occurred while executing this action.');
    }
  }

  private getUserInput(prompt: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(prompt, answer => {
        resolve(answer.trim());
      });
    });
  }

  private setupSignalHandlers(): void {
    process.on('SIGINT', async () => {
      this.logger.info('SIGINT received', 'ApplicationManager');
      await this.shutdown();
    });

    process.on('SIGTERM', async () => {
      this.logger.info('SIGTERM received', 'ApplicationManager');
      await this.shutdown();
    });

    process.on('uncaughtException', (error: Error) => {
      this.logger.fatal(
        `Uncaught exception: ${error.message}`,
        'ApplicationManager',
        { stack: error.stack }
      );
      this.shutdown().then(() => process.exit(1));
    });

    process.on('unhandledRejection', (reason: unknown) => {
      this.logger.fatal(
        `Unhandled rejection: ${reason}`,
        'ApplicationManager'
      );
    });
  }

  private async shutdown(): Promise<void> {
    if (this.applicationState === ApplicationState.SHUTTING_DOWN ||
        this.applicationState === ApplicationState.TERMINATED) {
      return;
    }

    this.applicationState = ApplicationState.SHUTTING_DOWN;
    this.logger.info('Application shutting down...', 'ApplicationManager');

    console.log('\n👋 Thank you for using the Design Patterns Demo System!');

    this.rl.close();
    this.logger.close();

    this.applicationState = ApplicationState.TERMINATED;
    process.exit(0);
  }

  public getApplicationState(): ApplicationState {
    return this.applicationState;
  }
}