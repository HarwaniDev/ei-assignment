import { ICommand } from './ICommand';
import { AddClassroomCommand } from './AddClassroomCommand';
import { AddStudentCommand } from './AddStudentCommand';
import { ScheduleAssignmentCommand } from './ScheduleAssignmentCommand';
import { SubmitAssignmentCommand } from './SubmitAssignmentCommand';
import { IClassroomRepository } from '../repositories/IClassroomRepository';
import { IStudentRepository } from '../repositories/IStudentRepository';
import { ILogger } from '../utils/ILogger';

export class CommandFactory {
  constructor(
    private readonly classroomRepository: IClassroomRepository,
    private readonly studentRepository: IStudentRepository,
    private readonly logger: ILogger
  ) {}

  createCommand(input: string): ICommand {
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();

    switch (command) {
      case 'add_classroom':
        if (parts.length < 2) {
          throw new Error('Usage: add_classroom <class_name>');
        }
        return new AddClassroomCommand(
          this.classroomRepository,
          parts.slice(1).join(' '),
          this.logger
        );

      case 'add_student':
        if (parts.length < 3) {
          throw new Error('Usage: add_student <student_id> <class_name>');
        }
        return new AddStudentCommand(
          this.studentRepository,
          this.classroomRepository,
          parts[1],
          parts.slice(2).join(' '),
          this.logger
        );

      case 'schedule_assignment':
        if (parts.length < 3) {
          throw new Error('Usage: schedule_assignment <class_name> <assignment_details>');
        }
        return new ScheduleAssignmentCommand(
          this.classroomRepository,
          parts[1],
          parts.slice(2).join(' '),
          this.logger
        );

      case 'submit_assignment':
        if (parts.length < 4) {
          throw new Error('Usage: submit_assignment <student_id> <class_name> <assignment_details>');
        }
        return new SubmitAssignmentCommand(
          this.classroomRepository,
          parts[1],
          parts[2],
          parts.slice(3).join(' '),
          this.logger
        );

      default:
        throw new Error(`Unknown command: ${command}`);
    }
  }
}
