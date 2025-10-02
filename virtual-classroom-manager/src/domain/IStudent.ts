export interface IStudent {
  getId(): string;
  getClassrooms(): string[];
  addClassroom(className: string): void;
  removeClassroom(className: string): void;
}
