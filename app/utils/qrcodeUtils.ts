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
class QrcodeUtils {
  /**
   * Validate input for QR code operations
   */
  private static validateFile(file: unknown): asserts file is File | Blob {
    if (!file) {
      throw new QRCodeValidationError('No file provided');
    }
    if (!(file instanceof File) && !(file instanceof Blob)) {
      throw new QRCodeValidationError(`Invalid file type. Expected File or Blob, got ${typeof file}`);
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
   * Create image from file/blob with proper error handling
   */
  private static async createImageFromFile(file: File | Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        const img = new Image();

        img.onload = () => resolve(img);
        img.onerror = () => reject(new QRCodeProcessingError('Failed to load image'));
        img.src = imageData;
      };

      reader.onerror = () => reject(new QRCodeProcessingError('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Extract image data from HTMLImageElement
   */
  private static extractImageData(img: HTMLImageElement): ImageData {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new QRCodeProcessingError('Failed to get canvas context');
    }

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  /**
   * Decode QR code from image file or blob
   * @param file - Image file or blob containing QR code
   * @returns Promise with decoded text result
   */
  public static async decode(file: File | Blob): Promise<QRDecodeResult> {
    try {
      this.validateFile(file);

      const img = await this.createImageFromFile(file);
      const imageData = this.extractImageData(img);

      // Create image object expected by qr library
      const imageForDecode = {
        width: imageData.width,
        height: imageData.height,
        data: imageData.data,
      };

      // Decode using qr library
      const decoded = decodeQR(imageForDecode);

      if (!decoded) {
        throw new QRCodeProcessingError('No QR code found in image');
      }

      return {
        data: decoded,
        format: 'QR_CODE',
      };
    } catch (error) {
      if (error instanceof QRCodeError) {
        throw error;
      }
      throw new QRCodeProcessingError(`Decode failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Merge user options with defaults
   */
  private static mergeOptions(options?: QRCodeOptions): Required<QRCodeOptions> {
    return { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Create canvas for QR code rendering
   */
  private static createCanvas(
    width: number,
    height: number,
  ): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new QRCodeProcessingError('Failed to get canvas context');
    }

    canvas.width = width;
    canvas.height = height;

    return { canvas, ctx };
  }

  /**
   * Render QR code data to canvas
   */
  private static renderQRCode(
    ctx: CanvasRenderingContext2D,
    qrData: boolean[][],
    options: Required<QRCodeOptions>,
  ): void {
    const { width, height, background, foreground, margin } = options;
    const moduleCount = qrData.length;
    const availableSize = Math.min(width, height) - 2 * margin;
    const moduleSize = Math.floor(availableSize / moduleCount);
    const offsetX = (width - moduleCount * moduleSize) / 2;
    const offsetY = (height - moduleCount * moduleSize) / 2;

    // Clear canvas with background color
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    // Draw QR code modules
    ctx.fillStyle = foreground;
    for (let row = 0; row < moduleCount; row++) {
      const rowData = qrData[row];
      if (!rowData) continue;

      for (let col = 0; col < rowData.length; col++) {
        if (rowData[col]) {
          ctx.fillRect(offsetX + col * moduleSize, offsetY + row * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  }

  /**
   * Convert canvas to blob with specified quality
   */
  private static async canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new QRCodeProcessingError('Failed to generate QR code blob'));
          }
        },
        'image/png',
        quality,
      );
    });
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
      const opts = this.mergeOptions(options);

      // Generate QR code data using the qr library
      const qrData = encodeQR(text, 'raw');

      // Create canvas and render QR code
      const { canvas, ctx } = this.createCanvas(opts.width, opts.height);
      this.renderQRCode(ctx, qrData, opts);

      // Convert to blob and data URL
      const blob = await this.canvasToBlob(canvas, opts.quality);
      const dataUrl = await this.blobToDataURL(blob);

      return { blob, dataUrl };
    } catch (error) {
      if (error instanceof QRCodeError) {
        throw error;
      }
      throw new QRCodeProcessingError(`Encode failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert blob to data URL
   */
  private static async blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new QRCodeProcessingError('Failed to convert blob to data URL'));
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Generate QR code as data URL
   * @param text - Text to encode
   * @param options - QR code generation options
   * @returns Promise with QR code data URL
   */
  public static async encodeAsDataURL(text: string, options?: QRCodeOptions): Promise<string> {
    const result = await this.encode(text, options);
    return result.dataUrl;
  }

  /**
   * Generate QR code as blob
   * @param text - Text to encode
   * @param options - QR code generation options
   * @returns Promise with QR code blob
   */
  public static async encodeAsBlob(text: string, options?: QRCodeOptions): Promise<Blob> {
    const result = await this.encode(text, options);
    return result.blob;
  }

  /**
   * Download QR code as file
   * @param text - Text to encode
   * @param filename - Filename for download
   * @param options - QR code generation options
   */
  public static async downloadQRCode(
    text: string,
    filename: string = 'qrcode.png',
    options?: QRCodeOptions,
  ): Promise<void> {
    try {
      const { blob } = await this.encode(text, options);

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;

      // Trigger download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      if (error instanceof QRCodeError) {
        throw error;
      }
      throw new QRCodeProcessingError(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate if a string can be encoded as QR code
   * @param text - Text to validate
   * @returns true if text can be encoded
   */
  public static canEncode(text: string): boolean {
    try {
      this.validateText(text);
      // Try to encode a small version to validate
      encodeQR(text, 'raw');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get estimated QR code dimensions for given text
   * @param text - Text to analyze
   * @returns Object with estimated dimensions
   */
  public static getEstimatedDimensions(text: string): { modules: number; minSize: number } {
    try {
      this.validateText(text);
      const qrData = encodeQR(text, 'raw');
      const modules = qrData.length;
      const minSize = modules * 4; // Minimum 4px per module for readability

      return { modules, minSize };
    } catch (error) {
      if (error instanceof QRCodeError) {
        throw error;
      }
      throw new QRCodeProcessingError(
        `Failed to analyze text: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Create QR code with automatic size optimization
   * @param text - Text to encode
   * @param maxSize - Maximum size constraint
   * @param options - Additional options
   * @returns Promise with optimized QR code result
   */
  public static async encodeOptimized(
    text: string,
    maxSize: number = 512,
    options?: Omit<QRCodeOptions, 'width' | 'height'>,
  ): Promise<QREncodeResult> {
    const { minSize } = this.getEstimatedDimensions(text);
    const optimalSize = Math.min(maxSize, Math.max(minSize, 256));

    return this.encode(text, {
      ...options,
      width: optimalSize,
      height: optimalSize,
    });
  }

  /**
   * Batch decode multiple QR codes
   * @param files - Array of image files containing QR codes
   * @returns Promise with array of decode results
   */
  public static async batchDecode(files: (File | Blob)[]): Promise<(QRDecodeResult | Error)[]> {
    const results = await Promise.allSettled(files.map((file) => this.decode(file)));

    return results.map((result) => (result.status === 'fulfilled' ? result.value : result.reason));
  }

  /**
   * Batch encode multiple texts
   * @param texts - Array of texts to encode
   * @param options - QR code generation options
   * @returns Promise with array of encode results
   */
  public static async batchEncode(texts: string[], options?: QRCodeOptions): Promise<(QREncodeResult | Error)[]> {
    const results = await Promise.allSettled(texts.map((text) => this.encode(text, options)));

    return results.map((result) => (result.status === 'fulfilled' ? result.value : result.reason));
  }
}

export { QrcodeUtils };
export default QrcodeUtils;
