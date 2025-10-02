import { IStudent } from './IStudent';

export class Student implements IStudent {
  private readonly id: string;
  private readonly classrooms: Set<string>;

  constructor(id: string) {
    if (!id || id.trim().length === 0) {
      throw new Error('Student ID cannot be empty');
    }
    this.id = id.trim();
    this.classrooms = new Set();
  }

  getId(): string {
    return this.id;
  }

  getClassrooms(): string[] {
    return Array.from(this.classrooms);
  }

  addClassroom(className: string): void {
    this.classrooms.add(className.trim());
  }

  removeClassroom(className: string): void {
    this.classrooms.delete(className.trim());
  }
}
