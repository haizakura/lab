import encodeQR from 'qr';
import decodeQR from 'qr/decode.js';
import type { QrOpts } from 'qr';

/**
 * QRCode Options
 * @description Options for QR code operations
 */
interface QRCodeOptions extends QrOpts {
  scale?: number;
}

/**
 * QRDecode Result
 * @description Result of QR code decoding
 */
type QRDecodeResult = {
  data: string;
};

/**
 * QREncode Result
 * @description Result of QR code encoding
 */
type QREncodeResult = {
  data: Uint8Array;
};

/**
 * QRDecode Image Data
 * @description Image data for QR code decoding
 */
type QRDecodeImageData = {
  width: number;
  height: number;
  data: Uint8Array | Uint8ClampedArray | number[];
};

/**
 * QRCode Utilities
 * @description Utility class for QR code operations
 */
class QrcodeUtils {
  /**
   * Validate input for QR code operations
   * @param imageData - Image data to validate
   */
  private static validateImageData(imageData: unknown): asserts imageData is QRDecodeImageData {
    if (!imageData) {
      throw new QRCodeValidationError('No image data provided');
    }
    if (!(imageData as QRDecodeImageData)) {
      throw new QRCodeValidationError(`Invalid image data type. Expected QRDecodeImageData, got ${typeof imageData}`);
    }
  }

  /**
   * Validate text input for encoding
   */
  private static validateText(text: unknown): asserts text is string {
    if (!text || typeof text !== 'string') {
      throw new QRCodeValidationError('Invalid text. Expected non-empty string');
    }
  }

  /**
   * Decode QR code from image file
   * @param imageData - Image data ontaining QR code
   * @returns Promise with decoded text result
   */
  public static async decode(imageData: QRDecodeImageData): Promise<QRDecodeResult> {
    try {
      this.validateImageData(imageData);

      const decoded = decodeQR(imageData);

      if (!decoded) {
        throw new QRCodeProcessingError('No QR code found in image');
      }

      return {
        data: decoded,
      };
    } catch (error) {
      if (error instanceof QRCodeError) {
        throw error;
      }
      throw new QRCodeProcessingError(`Decode failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Encode text to QR code image
   * @param text - Text to encode
   * @param options - QR code generation options
   * @returns Promise with encoded QR code result
   */
  public static async encode(text: string, options?: QRCodeOptions): Promise<QREncodeResult> {
    try {
      this.validateText(text);

      const qrData = encodeQR(text, 'gif', options);

      return {
        data: qrData,
      };
    } catch (error) {
      if (error instanceof QRCodeError) {
        throw error;
      }
      throw new QRCodeProcessingError(`Encode failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export { QrcodeUtils };
export default QrcodeUtils;
