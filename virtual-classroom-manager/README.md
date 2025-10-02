# Virtual Classroom Manager

A terminal-based Virtual Classroom Manager built with TypeScript following SOLID principles and best practices.

## Features

- Classroom management
- Student enrollment
- Assignment scheduling and submission
- Comprehensive logging
- Error handling with retry logic
- Clean architecture with separation of concerns

## Project Structure

```
virtual-classroom-manager/
├── src/
│   ├── domain/           # Domain models and interfaces
│   ├── repositories/     # Data access layer
│   ├── commands/         # Command pattern implementations
│   ├── services/         # Business logic
│   ├── utils/            # Utilities (logger, etc.)
│   └── index.ts          # Entry point
├── tests/                # Test files
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

```bash
npm install
```

## Usage

### Development mode
```bash
npm run dev
```

### Build and run
```bash
npm run build
npm start
```

## Available Commands

- `add_classroom <class_name>` - Create a new classroom
- `add_student <student_id> <class_name>` - Enroll a student in a classroom
- `schedule_assignment <class_name> <assignment_details>` - Schedule an assignment
- `submit_assignment <student_id> <class_name> <assignment_details>` - Submit an assignment
- `exit` - Exit the application

## Examples

```
VCM> add_classroom Math101
Classroom Math101 has been created.

VCM> add_student S001 Math101
Student S001 has been enrolled in Math101.

VCM> schedule_assignment Math101 Algebra-Homework
Assignment for Math101 has been scheduled.

VCM> submit_assignment S001 Math101 Algebra-Homework
Assignment submitted by Student S001 in Math101.
```

## Design Patterns Used

- **Command Pattern**: Encapsulates operations as objects
- **Repository Pattern**: Abstracts data access
- **Factory Pattern**: Creates commands dynamically
- **Strategy Pattern**: Pluggable logger implementation

## SOLID Principles

- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed**: Extensible through interfaces
- **Liskov Substitution**: All implementations can substitute their interfaces
- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Depends on abstractions

## License

MIT
