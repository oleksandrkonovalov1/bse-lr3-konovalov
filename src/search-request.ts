import { IdentifierType } from './types.js';

/** Запит на пошук публікації за ідентифікатором (DOI, ISBN або URL) */
export class SearchRequest {
  private readonly identifier: string;
  private readonly type: IdentifierType | null;

  constructor(identifier: string) {
    this.identifier = identifier.trim();
    this.type = this.detectType();
  }

  /** Перевіряє коректність ідентифікатора відповідно до його типу */
  validate(): boolean {
    if (!this.identifier || !this.type) return false;

    switch (this.type) {
      case IdentifierType.DOI:
        return /^10\.\d{4,}\/\S+$/.test(this.identifier);
      case IdentifierType.ISBN:
        return this.isValidIsbn();
      case IdentifierType.URL:
        try {
          const url = new URL(this.identifier);
          return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
          return false;
        }
    }
  }

  /** Повертає визначений тип ідентифікатора або кидає помилку, якщо тип не вдалось визначити */
  getType(): IdentifierType {
    if (!this.type) {
      throw new Error(`Cannot determine identifier type for: ${this.identifier}`);
    }
    return this.type;
  }

  /** Повертає нормалізований рядок ідентифікатора */
  getIdentifier(): string {
    return this.identifier;
  }

  private detectType(): IdentifierType | null {
    if (this.identifier.startsWith('10.')) return IdentifierType.DOI;
    if (/^https?:\/\//i.test(this.identifier)) return IdentifierType.URL;
    const cleaned = this.identifier.replace(/[-\s]/g, '');
    if (/^\d{10}(\d{3})?$/.test(cleaned)) return IdentifierType.ISBN;
    return null;
  }

  private isValidIsbn(): boolean {
    const digits = this.identifier.replace(/[-\s]/g, '');
    if (digits.length === 10) return this.checksumIsbn10(digits);
    if (digits.length === 13) return this.checksumIsbn13(digits);
    return false;
  }

  private checksumIsbn10(digits: string): boolean {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += (10 - i) * parseInt(digits[i]);
    }
    const last = digits[9].toUpperCase();
    sum += last === 'X' ? 10 : parseInt(last);
    return sum % 11 === 0;
  }

  private checksumIsbn13(digits: string): boolean {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += (i % 2 === 0 ? 1 : 3) * parseInt(digits[i]);
    }
    const check = (10 - (sum % 10)) % 10;
    return check === parseInt(digits[12]);
  }
}
