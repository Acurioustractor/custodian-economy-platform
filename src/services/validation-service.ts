// Validation Service
// Provides validation utilities for form data and user input

export class ValidationService {
  
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  validateRequired(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  sanitizeString(input: string): string {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
}

export const validationService = new ValidationService();