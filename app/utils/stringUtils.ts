import md5 from 'md5';
import CryptoJS from 'crypto-js';

/**
 * String utilities
 * @description String utilities for encoding, decoding, and hashing
 * @description Supports base64, md5, sha1, sha256, sha384, sha512, uri, uri-component
 */
class StringUtils {
  /**
   * String to encode/decode/hash
   */
  private readonly str: string;

  /**
   * Type of encoding/decoding/hashing
   */
  private readonly type: string;

  /**
   * Constructor
   * @param str - String to encode/decode/hash
   * @param type - Type of encoding/decoding/hashing
   */
  constructor(str: string, type: string) {
    this.str = str;
    this.type = type;
  }

  /**
   * Encode/Hash the string
   * @returns Encoded/Hashed string
   */
  public encode(): string {
    switch (this.type) {
      case 'base64':
        return this.encodeBase64();
      case 'md5':
        return this.hashMD5();
      case 'sha1':
        return this.hashSHA1();
      case 'sha256':
        return this.hashSHA256();
      case 'sha384':
        return this.hashSHA384();
      case 'sha512':
        return this.hashSHA512();
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
    switch (this.type) {
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
      throw new Error(error as string);
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
      throw new Error(error as string);
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
      throw new Error(error as string);
    }
  }

  /**
   * Hash the string using SHA-1
   * @returns Hashed string
   */
  private hashSHA1(): string {
    try {
      const res = CryptoJS.SHA1(this.str).toString();
      return res;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  /**
   * Hash the string using SHA-256
   * @returns Hashed string
   */
  private hashSHA256(): string {
    try {
      const res = CryptoJS.SHA256(this.str).toString();
      return res;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  /**
   * Hash the string using SHA-384
   * @returns Hashed string
   */
  private hashSHA384(): string {
    try {
      const res = CryptoJS.SHA384(this.str).toString();
      return res;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  /**
   * Hash the string using SHA-512
   * @returns Hashed string
   */
  private hashSHA512(): string {
    try {
      const res = CryptoJS.SHA512(this.str).toString();
      return res;
    } catch (error) {
      throw new Error(error as string);
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
      throw new Error(error as string);
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
      throw new Error(error as string);
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
      throw new Error(error as string);
    }
  }
}

export { StringUtils };
