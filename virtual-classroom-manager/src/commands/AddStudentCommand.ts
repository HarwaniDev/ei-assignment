import { ICommand } from './ICommand';
import { IStudentRepository } from '../repositories/IStudentRepository';
import { IClassroomRepository } from '../repositories/IClassroomRepository';
import { Student } from '../domain/Student';
import { ILogger } from '../utils/ILogger';

export class AddStudentCommand implements ICommand {
  constructor(
    private readonly studentRepository: IStudentRepository,
    private readonly classroomRepository: IClassroomRepository,
    private readonly studentId: string,
    private readonly className: string,
    private readonly logger: ILogger
  ) {}

  execute(): string {
    try {
      this.logger.debug(`Attempting to enroll student ${this.studentId} in ${this.className}`);

      const classroom = this.classroomRepository.findByName(this.className);
      if (!classroom) {
        throw new Error(`Classroom ${this.className} does not exist`);
      }

      let student = this.studentRepository.findById(this.studentId);
      if (!student) {
        student = new Student(this.studentId);
        this.studentRepository.add(student);
        this.logger.info(`New student created: ${this.studentId}`);
      }

      classroom.addStudent(this.studentId);
      student.addClassroom(this.className);

      const message = `Student ${this.studentId} has been enrolled in ${this.className}.`;
      this.logger.info(`Student enrolled: ${this.studentId} -> ${this.className}`);
      return message;
    } catch (error) {
      this.logger.error(`Failed to enroll student ${this.studentId} in ${this.className}`, error as Error);
      throw error;
    }
  }
}
