export class ApplicationError extends Error {
    constructor(
      message: string,
      public readonly code: string,
      public readonly isOperational: boolean = true,
      public readonly metadata?: Record<string, unknown>
    ) {
      super(message);
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class ValidationError extends ApplicationError {
    constructor(message: string, metadata?: Record<string, unknown>) {
      super(message, 'VALIDATION_ERROR', true, metadata);
    }
  }
  
  export class TransientError extends ApplicationError {
    constructor(message: string, metadata?: Record<string, unknown>) {
      super(message, 'TRANSIENT_ERROR', true, metadata);
    }
  }
  
  export class ConfigurationError extends ApplicationError {
    constructor(message: string, metadata?: Record<string, unknown>) {
      super(message, 'CONFIGURATION_ERROR', false, metadata);
    }
  }
  
  export class OperationError extends ApplicationError {
    constructor(message: string, metadata?: Record<string, unknown>) {
      super(message, 'OPERATION_ERROR', true, metadata);
    }
  }