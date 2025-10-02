import { ICommand } from './ICommand';
import { IClassroomRepository } from '../repositories/IClassroomRepository';
import { ILogger } from '../utils/ILogger';

export class ScheduleAssignmentCommand implements ICommand {
  constructor(
    private readonly classroomRepository: IClassroomRepository,
    private readonly className: string,
    private readonly assignmentDetails: string,
    private readonly logger: ILogger
  ) {}

  execute(): string {
    try {
      this.logger.debug(`Attempting to schedule assignment for ${this.className}`);

      const classroom = this.classroomRepository.findByName(this.className);
      if (!classroom) {
        throw new Error(`Classroom ${this.className} does not exist`);
      }

      classroom.addAssignment(this.assignmentDetails);

      const message = `Assignment for ${this.className} has been scheduled.`;
      this.logger.info(`Assignment scheduled: ${this.className} - ${this.assignmentDetails}`);
      return message;
    } catch (error) {
      this.logger.error(`Failed to schedule assignment for ${this.className}`, error as Error);
      throw error;
    }
  }
}
