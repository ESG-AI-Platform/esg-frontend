export interface ErrorInfo {
  message: string;
  code?: string;
  statusCode?: number;
  timestamp: string;
  path?: string;
  stack?: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly timestamp: string;
  public readonly path?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    path?: string,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date().toISOString();
    this.path = path;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toJSON(): ErrorInfo {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      path: this.path,
      stack: process.env.NODE_ENV === "development" ? this.stack : undefined,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, path?: string) {
    super(message, 400, "VALIDATION_ERROR", path);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required", path?: string) {
    super(message, 401, "AUTHENTICATION_ERROR", path);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions", path?: string) {
    super(message, 403, "AUTHORIZATION_ERROR", path);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", path?: string) {
    super(message, 404, "NOT_FOUND_ERROR", path);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict", path?: string) {
    super(message, 409, "CONFLICT_ERROR", path);
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Rate limit exceeded", path?: string) {
    super(message, 429, "RATE_LIMIT_ERROR", path);
    this.name = "RateLimitError";
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network error", path?: string) {
    super(message, 0, "NETWORK_ERROR", path);
    this.name = "NetworkError";
  }
}

export const errorHandler = {
  // Handle API errors
  handleApiError: (error: unknown, path?: string): AppError => {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      // Handle fetch errors
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        return new NetworkError("Unable to connect to server", path);
      }

      return new AppError(error.message, 500, "UNKNOWN_ERROR", path);
    }

    // Handle string errors
    if (typeof error === "string") {
      return new AppError(error, 500, "UNKNOWN_ERROR", path);
    }

    // Handle object errors (like response errors)
    if (typeof error === "object" && error !== null) {
      const errorObj = error as Record<string, unknown>;
      const message = (errorObj.message || "Unknown error") as string;
      const statusCode = (errorObj.statusCode || 500) as number;
      const code = (errorObj.code || "UNKNOWN_ERROR") as string;

      return new AppError(message, statusCode, code, path);
    }

    return new AppError("Unknown error occurred", 500, "UNKNOWN_ERROR", path);
  },

  // Log errors
  logError: (error: AppError, context?: Record<string, unknown>): void => {
    const errorLog = {
      ...error.toJSON(),
      context,
      userAgent:
        typeof window !== "undefined" ? navigator.userAgent : undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };

    if (process.env.NODE_ENV === "development") {
      console.error("[Error]", errorLog);
    } else {
      // In production, send to logging service
      // Example: Sentry, LogRocket, etc.
      console.error("[Error]", {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        timestamp: error.timestamp,
      });
    }
  },

  // Get user-friendly error message
  getUserMessage: (error: AppError): string => {
    switch (error.code) {
      case "VALIDATION_ERROR":
        return "Please check your input and try again.";
      case "AUTHENTICATION_ERROR":
        return "Please log in to continue.";
      case "AUTHORIZATION_ERROR":
        return "You do not have permission to perform this action.";
      case "NOT_FOUND_ERROR":
        return "The requested resource was not found.";
      case "CONFLICT_ERROR":
        return "This action conflicts with existing data.";
      case "RATE_LIMIT_ERROR":
        return "Too many requests. Please try again later.";
      case "NETWORK_ERROR":
        return "Unable to connect. Please check your internet connection.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  },

  // Check if error should be retried
  isRetryable: (error: AppError): boolean => {
    return ["NETWORK_ERROR", "RATE_LIMIT_ERROR"].includes(error.code || "");
  },

  // Get retry delay in milliseconds
  getRetryDelay: (error: AppError, attempt: number): number => {
    if (error.code === "RATE_LIMIT_ERROR") {
      return Math.min(1000 * Math.pow(2, attempt), 30000); // Exponential backoff, max 30s
    }

    if (error.code === "NETWORK_ERROR") {
      return Math.min(1000 * attempt, 10000); // Linear backoff, max 10s
    }

    return 1000; // Default 1s
  },
};
