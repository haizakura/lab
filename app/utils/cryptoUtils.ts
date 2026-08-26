import md5 from 'md5';

/**
 * Crypto utilities
 * @description Crypto utilities for encoding, decoding, and hashing
 * @description Supports base64, md5, sha1, sha256, sha384, sha512, uri, uri-component
 */
class CryptoUtils {
  /**
   * String to encode/decode/hash
   */
  private readonly str: string;

  /**
   * Operation of encoding/decoding/hashing
   */
  private readonly operation: string;

  /**
   * Constructor
   * @param str - String to encode/decode/hash
   * @param operation - Operation of encoding/decoding/hashing
   */
  constructor(str: string, operation: string) {
    this.str = str;
    this.operation = operation;
  }

  /**
   * Encode/Hash the string
   * @returns Encoded/Hashed string
   */
  public async encode(): Promise<string> {
    switch (this.operation) {
      case 'base64':
        return this.encodeBase64();
      case 'md5':
        return this.hashMD5();
      case 'sha1':
        return this.hashSHA('SHA-1');
      case 'sha256':
        return this.hashSHA('SHA-256');
      case 'sha384':
        return this.hashSHA('SHA-384');
      case 'sha512':
        return this.hashSHA('SHA-512');
      case 'uri':
        return this.encodeURI();
      case 'uri-component':
        return this.encodeURIComponent();
      default:
        return this.str;
    }
  }

  /**
   * Decode the string (only for reversible encodings like base64, uri)
   * @returns Decoded string
   */
  public decode(): string {
    switch (this.operation) {
      case 'base64':
        return this.decodeBase64();
      case 'uri':
        return this.decodeURI();
      case 'uri-component':
        return this.decodeURIComponent();
      default:
        return this.str;
    }
  }

  /**
   * Encode the string using Base64
   * @returns Encoded string
   */
  private encodeBase64(): string {
    try {
      const res = btoa(this.str);
      return res;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  /**
   * Decode the string using Base64
   * @returns Decoded string
   */
  private decodeBase64(): string {
    try {
      const res = atob(this.str);
      return res;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  /**
   * Hash the string using MD5 (for browsers)
   * @returns Hashed string
   */
  private hashMD5(): string {
    try {
      const res = md5(this.str);
      return res;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  /**
   * Hash the string using the browser Web Crypto API
   * @param algorithm - SHA algorithm supported by SubtleCrypto
   * @returns Hashed string
   */
  private async hashSHA(algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'): Promise<string> {
    try {
      const data = new TextEncoder().encode(this.str);
      const digest = await globalThis.crypto.subtle.digest(algorithm, data);
      return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      throw new Error(String(error));
    }
  }

  /**
   * Encode the string using URI
   * @returns Encoded string
   */
  private encodeURI(): string {
    try {
      const res = encodeURI(this.str);
      return res;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  /**
   * Decode the string using URI
   * @returns Decoded string
   */
  private decodeURI(): string {
    try {
      const res = decodeURI(this.str);
      return res;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  /**
   * Encode the string using URI Component
   * @returns Encoded string
   */
  private encodeURIComponent(): string {
    try {
      const res = encodeURIComponent(this.str);
      return res;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  /**
   * Decode the string using URI Component
   * @returns Decoded string
   */
  private decodeURIComponent(): string {
    try {
      const res = decodeURIComponent(this.str);
      return res;
    } catch (error) {
      throw new Error(String(error));
    }
  }
}

export { CryptoUtils };
