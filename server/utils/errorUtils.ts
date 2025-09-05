/**
 * QRCode Error
 * @description Error class for QR code operations
 */
export class QRCodeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'QRCodeError';
  }
}

/**
 * QRCode Validation Error
 * @description Error class for QR code validation operations
 */
export class QRCodeValidationError extends QRCodeError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}

/**
 * QRCode Processing Error
 * @description Error class for QR code processing operations
 */
export class QRCodeProcessingError extends QRCodeError {
  constructor(message: string) {
    super(message, 'PROCESSING_ERROR');
  }
}

/**
 * Error Utilities
 * @description Utility class for error operations
 */
class ErrorUtils {
  /**
   * Get error details
   * @param err - Error object
   * @returns Error details
   */
  public static getErrorDetails(err: unknown) {
    if (err && typeof err === 'object' && 'status' in err && 'statusText' in err) {
      return {
        status: typeof err.status === 'number' ? err.status : 500,
        statusText: typeof err.statusText === 'string' ? err.statusText : 'Internal Server Error',
      };
    }
    return {
      status: 500,
      statusText: 'Internal Server Error',
    };
  }
}

export { ErrorUtils };
export default ErrorUtils;
