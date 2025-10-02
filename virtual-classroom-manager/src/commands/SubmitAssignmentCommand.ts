import { ICommand } from './ICommand';
import { IClassroomRepository } from '../repositories/IClassroomRepository';
import { ILogger } from '../utils/ILogger';

export class SubmitAssignmentCommand implements ICommand {
  constructor(
    private readonly classroomRepository: IClassroomRepository,
    private readonly studentId: string,
    private readonly className: string,
    private readonly assignmentDetails: string,
    private readonly logger: ILogger
  ) {}

  execute(): string {
    try {
      this.logger.debug(`Attempting to submit assignment by ${this.studentId} in ${this.className}`);

      const classroom = this.classroomRepository.findByName(this.className);
      if (!classroom) {
        throw new Error(`Classroom ${this.className} does not exist`);
      }

      classroom.submitAssignment(this.studentId, this.assignmentDetails);

      const message = `Assignment submitted by Student ${this.studentId} in ${this.className}.`;
      this.logger.info(`Assignment submitted: ${this.studentId} in ${this.className}`);
      return message;
    } catch (error) {
      this.logger.error(`Failed to submit assignment by ${this.studentId}`, error as Error);
      throw error;
    }
  }
}
