import { IStudent } from '../domain/IStudent';

export interface IStudentRepository {
  add(student: IStudent): void;
  findById(id: string): IStudent | undefined;
  getAll(): IStudent[];
}
