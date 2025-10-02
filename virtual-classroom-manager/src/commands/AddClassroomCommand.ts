import { ICommand } from './ICommand';
import { IClassroomRepository } from '../repositories/IClassroomRepository';
import { Classroom } from '../domain/Classroom';
import { ILogger } from '../utils/ILogger';

export class AddClassroomCommand implements ICommand {
  constructor(
    private readonly classroomRepository: IClassroomRepository,
    private readonly className: string,
    private readonly logger: ILogger
  ) {}

  execute(): string {
    try {
      this.logger.debug(`Attempting to add classroom: ${this.className}`);
      const classroom = new Classroom(this.className);
      this.classroomRepository.add(classroom);
      const message = `Classroom ${this.className} has been created.`;
      this.logger.info(`Classroom created: ${this.className}`);
      return message;
    } catch (error) {
      this.logger.error(`Failed to add classroom: ${this.className}`, error as Error);
      throw error;
    }
  }
}
