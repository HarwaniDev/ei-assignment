import { IClassroom } from './IClassroom';

export class Classroom implements IClassroom {
  private readonly name: string;
  private readonly students: Set<string>;
  private readonly assignments: Set<string>;
  private readonly submissions: Map<string, Set<string>>;

  constructor(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error('Classroom name cannot be empty');
    }
    this.name = name.trim();
    this.students = new Set();
    this.assignments = new Set();
    this.submissions = new Map();
  }

  getName(): string {
    return this.name;
  }

  addStudent(studentId: string): void {
    if (!studentId || studentId.trim().length === 0) {
      throw new Error('Student ID cannot be empty');
    }
    this.students.add(studentId.trim());
  }

  removeStudent(studentId: string): void {
    this.students.delete(studentId.trim());
  }

  getStudents(): string[] {
    return Array.from(this.students);
  }

  addAssignment(assignmentDetails: string): void {
    if (!assignmentDetails || assignmentDetails.trim().length === 0) {
      throw new Error('Assignment details cannot be empty');
    }
    this.assignments.add(assignmentDetails.trim());
  }

  getAssignments(): string[] {
    return Array.from(this.assignments);
  }

  submitAssignment(studentId: string, assignmentDetails: string): void {
    const trimmedStudentId = studentId.trim();
    const trimmedAssignment = assignmentDetails.trim();

    if (!this.students.has(trimmedStudentId)) {
      throw new Error(`Student ${trimmedStudentId} is not enrolled in ${this.name}`);
    }

    if (!this.assignments.has(trimmedAssignment)) {
      throw new Error(`Assignment "${trimmedAssignment}" does not exist for ${this.name}`);
    }

    if (!this.submissions.has(trimmedStudentId)) {
      this.submissions.set(trimmedStudentId, new Set());
    }

    this.submissions.get(trimmedStudentId)!.add(trimmedAssignment);
  }

  getSubmissions(): Map<string, string[]> {
    const result = new Map<string, string[]>();
    this.submissions.forEach((assignments, studentId) => {
      result.set(studentId, Array.from(assignments));
    });
    return result;
  }
}
