import { IValidationResult } from '../../types/common.types';
import { ValidationError } from '../error-handler/custom-errors';

export class Validator {
  public static validateNotEmpty(value: string, fieldName: string): IValidationResult {
    const errors: string[] = [];
    
    if (!value || value.trim().length === 0) {
      errors.push(`${fieldName} cannot be empty`);
    }

    return { isValid: errors.length === 0, errors };
  }

  public static validateNumericRange(
    value: number,
    fieldName: string,
    min?: number,
    max?: number
  ): IValidationResult {
    const errors: string[] = [];

    if (isNaN(value)) {
      errors.push(`${fieldName} must be a valid number`);
      return { isValid: false, errors };
    }

    if (min !== undefined && value < min) {
      errors.push(`${fieldName} must be at least ${min}`);
    }

    if (max !== undefined && value > max) {
      errors.push(`${fieldName} must be at most ${max}`);
    }

    return { isValid: errors.length === 0, errors };
  }

  public static validateEmail(email: string): IValidationResult {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }

    return { isValid: errors.length === 0, errors };
  }

  public static validateChoice<T>(
    value: T,
    allowedValues: T[],
    fieldName: string
  ): IValidationResult {
    const errors: string[] = [];

    if (!allowedValues.includes(value)) {
      errors.push(
        `${fieldName} must be one of: ${allowedValues.join(', ')}`
      );
    }

    return { isValid: errors.length === 0, errors };
  }

  public static combineValidationResults(...results: IValidationResult[]): IValidationResult {
    const allErrors = results.flatMap(r => r.errors);
    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }

  public static throwIfInvalid(result: IValidationResult, context: string): void {
    if (!result.isValid) {
      throw new ValidationError(
        `Validation failed in ${context}`,
        { errors: result.errors }
      );
    }
  }
}