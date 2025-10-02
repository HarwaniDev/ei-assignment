import { IStudent } from '../domain/IStudent';
import { IStudentRepository } from './IStudentRepository';

export class InMemoryStudentRepository implements IStudentRepository {
  private readonly students: Map<string, IStudent>;

  constructor() {
    this.students = new Map();
  }

  add(student: IStudent): void {
    const id = student.getId().toLowerCase();
    if (this.students.has(id)) {
      throw new Error(`Student ${student.getId()} already exists`);
    }
    this.students.set(id, student);
  }

  findById(id: string): IStudent | undefined {
    return this.students.get(id.toLowerCase());
  }

  getAll(): IStudent[] {
    return Array.from(this.students.values());
  }
}
