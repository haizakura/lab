import encodeQR from 'qr';
import decodeQR from 'qr/decode.js';

/**
 * QRCode Options
 * @description Options for QR code operations
 */
export interface QRCodeOptions {
  width?: number;
  height?: number;
  quality?: number;
  margin?: number;
  background?: string;
  foreground?: string;
}

/**
 * QRDecode Result
 * @description Result of QR code decoding
 */
export interface QRDecodeResult {
  data: string;
  format?: string;
}

/**
 * QREncode Result
 * @description Result of QR code encoding
 */
export interface QREncodeResult {
  blob: Blob;
  dataUrl: string;
}

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
 * Default Options
 * @description Default options for QR code operations
 */
const DEFAULT_OPTIONS: Required<QRCodeOptions> = {
  width: 256,
  height: 256,
  quality: 0.95,
  margin: 0,
  background: '#FFFFFF',
  foreground: '#000000',
};

/**
 * QRCode Utilities
 * @description Utility class for QR code operations
 */
class QrcodeUtils {}

export { QrcodeUtils };
export default QrcodeUtils;
