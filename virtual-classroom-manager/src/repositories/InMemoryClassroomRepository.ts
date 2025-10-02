import { IClassroom } from '../domain/IClassroom';
import { IClassroomRepository } from './IClassroomRepository';

export class InMemoryClassroomRepository implements IClassroomRepository {
  private readonly classrooms: Map<string, IClassroom>;

  constructor() {
    this.classrooms = new Map();
  }

  add(classroom: IClassroom): void {
    const name = classroom.getName().toLowerCase();
    if (this.classrooms.has(name)) {
      throw new Error(`Classroom ${classroom.getName()} already exists`);
    }
    this.classrooms.set(name, classroom);
  }

  findByName(name: string): IClassroom | undefined {
    return this.classrooms.get(name.toLowerCase());
  }

  getAll(): IClassroom[] {
    return Array.from(this.classrooms.values());
  }

  remove(name: string): boolean {
    return this.classrooms.delete(name.toLowerCase());
  }
}
