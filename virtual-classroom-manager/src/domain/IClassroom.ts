export interface IClassroom {
  getName(): string;
  addStudent(studentId: string): void;
  removeStudent(studentId: string): void;
  getStudents(): string[];
  addAssignment(assignmentDetails: string): void;
  getAssignments(): string[];
  submitAssignment(studentId: string, assignmentDetails: string): void;
  getSubmissions(): Map<string, string[]>;
}
