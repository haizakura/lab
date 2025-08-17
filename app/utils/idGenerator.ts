import { v4 as uuidv4, v1 as uuidv1 } from 'uuid';

/**
 * ID Generator
 * @description Generate a random ID. Supports UUID v4, CUID, and UUID v1.
 */
class IdGenerator {
  /**
   * ID Type
   */
  private readonly idType: string;

  /**
   * ID Length
   */
  private readonly idLength: number | undefined;

  /**
   * Constructor
   * @param idType - ID Type
   * @param idLength - ID Length
   */
  constructor(idType: string, idLength: number | undefined = undefined) {
    this.idType = idType;
    this.idLength = idLength;
  }

  /**
   * Generate a random ID
   * @returns Random ID String
   */
  generate(): string {
    switch (this.idType) {
      case 'uuidv4':
        return this.generateUuidv4();
      case 'cuid':
        return this.generateCuid();
      case 'uuidv1':
        return this.generateUuidv1();
      default:
        return this.generateRandom();
    }
  }

  /**
   * Generate random bytes using Web Crypto API or fallback
   * @param length - Number of bytes to generate
   * @returns Hex String
   */
  private getRandomBytes(length: number): string {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      // Browser environment with Web Crypto API
      const array = new Uint8Array(length);
      window.crypto.getRandomValues(array);
      return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback for environments without Web Crypto API
      let result = '';
      for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, '0');
      }
      return result;
    }
  }

  /**
   * Generate a UUID v4
   * @description UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
   * @description Based on random bytes
   * @returns UUID v4 String
   */
  private generateUuidv4() {
    const res = uuidv4();
    return res;
  }

  /**
   * Generate a CUID
   * @description CUID format: c + timestamp(base36) + counter(base36) + machine_id(base36) + random(base36)
   * @returns CUID String
   */
  private generateCuid() {
    const timestamp = Date.now().toString(36);
    const counter = Math.floor(Math.random() * 1296)
      .toString(36)
      .padStart(2, '0'); // 0-zz in base36
    const machineId = this.getRandomBytes(2);
    const randomPart = this.getRandomBytes(4);

    return `c${timestamp}${counter}${machineId}${randomPart}`;
  }

  /**
   * Generate a UUID v1
   * @description UUID v1 format: xxxxxxxx-xxxx-1xxx-xxxx-xxxxxxxxxxxx
   * @description Based on timestamp and node ID (simulated MAC address)
   * @returns UUID v1 String
   */
  private generateUuidv1() {
    const res = uuidv1();
    return res;
  }

  /**
   * Generate a random string (16 characters)
   * @returns Random string
   */
  private generateRandom() {
    return this.getRandomBytes(this.idLength || 16);
  }
}

export { IdGenerator };
