// Error Handling Service
// Centralized error handling and logging

export interface ErrorReport {
  error: Error;
  context: string;
  timestamp: Date;
  userId?: string;
}

export class ErrorHandlingService {
  
  handleError(error: Error, context: string, userId?: string): void {
    const report: ErrorReport = {
      error,
      context,
      timestamp: new Date(),
      userId
    };
    
    console.error('Error Report:', report);
    
    // In production, this would:
    // 1. Log to external service
    // 2. Send alerts if critical
    // 3. Store for analysis
  }

  logWarning(message: string, context: string): void {
    console.warn(`[${context}] ${message}`);
  }

  logInfo(message: string, context: string): void {
    console.info(`[${context}] ${message}`);
  }
}

export const errorHandlingService = new ErrorHandlingService();