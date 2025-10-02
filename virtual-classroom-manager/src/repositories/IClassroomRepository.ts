import { IClassroom } from '../domain/IClassroom';

export interface IClassroomRepository {
  add(classroom: IClassroom): void;
  findByName(name: string): IClassroom | undefined;
  getAll(): IClassroom[];
  remove(name: string): boolean;
}
