import { IClassroomRepository } from '../repositories/IClassroomRepository';
import { IStudentRepository } from '../repositories/IStudentRepository';
import { InMemoryClassroomRepository } from '../repositories/InMemoryClassroomRepository';
import { InMemoryStudentRepository } from '../repositories/InMemoryStudentRepository';
import { ILogger } from '../utils/ILogger';
import { ConsoleLogger } from '../utils/ConsoleLogger';
import { CommandFactory } from '../commands/CommandFactory';
import { ICommand } from '../commands/ICommand';
import * as readline from 'readline';

export class VirtualClassroomManager {
  private readonly classroomRepository: IClassroomRepository;
  private readonly studentRepository: IStudentRepository;
  private readonly logger: ILogger;
  private readonly commandFactory: CommandFactory;

  constructor() {
    this.classroomRepository = new InMemoryClassroomRepository();
    this.studentRepository = new InMemoryStudentRepository();
    this.logger = new ConsoleLogger();
    this.commandFactory = new CommandFactory(
      this.classroomRepository,
      this.studentRepository,
      this.logger
    );

    this.logger.info('Virtual Classroom Manager initialized');
  }

  processCommand(input: string): void {
    if (!input || input.trim().length === 0) {
      console.log('Please enter a command.');
      return;
    }

    try {
      const command = this.commandFactory.createCommand(input);
      const result = this.executeWithRetry(command, 3);
      console.log(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`Error: ${errorMessage}`);
    }
  }

  private executeWithRetry(command: ICommand, maxRetries: number): string {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return command.execute();
      } catch (error) {
        lastError = error as Error;
        
        if (this.isTransientError(error as Error) && attempt < maxRetries) {
          this.logger.warn(`Transient error on attempt ${attempt}, retrying...`);
          this.sleep(Math.pow(2, attempt) * 100);
        } else {
          throw error;
        }
      }
    }

    throw lastError;
  }

  private isTransientError(error: Error): boolean {
    const transientPatterns = ['timeout', 'network', 'unavailable', 'temporary'];
    const errorMessage = error.message.toLowerCase();
    return transientPatterns.some(pattern => errorMessage.includes(pattern));
  }

  private sleep(ms: number): void {
    const start = Date.now();
    while (Date.now() - start < ms) {
      // Busy wait
    }
  }

  start(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'VCM> '
    });

    console.log('Virtual Classroom Manager');
    console.log('Available commands:');
    console.log('  add_classroom <class_name>');
    console.log('  add_student <student_id> <class_name>');
    console.log('  schedule_assignment <class_name> <assignment_details>');
    console.log('  submit_assignment <student_id> <class_name> <assignment_details>');
    console.log('  exit\n');

    rl.prompt();

    rl.on('line', (line: string) => {
      const input = line.trim();

      if (input.toLowerCase() === 'exit') {
        console.log('Goodbye!');
        rl.close();
        return;
      }

      this.processCommand(input);
      rl.prompt();
    });

    rl.on('close', () => {
      this.logger.info('Virtual Classroom Manager shutting down');
      process.exit(0);
    });
  }
}
