import { describe, it, expect } from 'vitest';
import { SearchRequest } from './search-request.js';
import { IdentifierType } from './types.js';

describe('SearchRequest', () => {
  describe('validate()', () => {
    it('accepts valid DOI', () => { // EP: valid DOI class
      // Arrange
      const req = new SearchRequest('10.1000/xyz');
      // Act
      const result = req.validate();
      // Assert
      expect(result).toBe(true);
    });

    it('accepts DOI with complex suffix', () => { // EP: valid DOI, complex suffix
      // Arrange
      const req = new SearchRequest('10.1038/s41586-021-03819-2');
      // Act & Assert
      expect(req.validate()).toBe(true);
    });

    it('rejects DOI with registrant shorter than 4 digits', () => { // BVA: DOI registrant boundary
      // Arrange
      const req = new SearchRequest('10.1/x');
      // Act & Assert
      expect(req.validate()).toBe(false);
    });

    it('accepts DOI with exactly 4-digit registrant', () => { // BVA: minimal valid DOI
      // Arrange
      const req = new SearchRequest('10.1000/x');
      // Act & Assert
      expect(req.validate()).toBe(true);
    });

    it('accepts valid ISBN-13 with hyphens', () => { // EP: valid ISBN-13
      // Arrange
      const req = new SearchRequest('978-3-16-148410-0');
      // Act & Assert
      expect(req.validate()).toBe(true);
    });

    it('accepts valid ISBN-10', () => { // EP: valid ISBN-10
      // Arrange
      const req = new SearchRequest('0306406152');
      // Act & Assert
      expect(req.validate()).toBe(true);
    });

    it('rejects ISBN-13 with bad checksum', () => { // EP: invalid ISBN checksum
      // Arrange
      const req = new SearchRequest('978-3-16-148410-1');
      // Act & Assert
      expect(req.validate()).toBe(false);
    });

    it('accepts valid HTTPS URL', () => { // EP: valid URL
      // Arrange
      const req = new SearchRequest('https://example.com/article');
      // Act & Assert
      expect(req.validate()).toBe(true);
    });

    it('accepts valid HTTP URL', () => { // EP: valid URL, http protocol
      // Arrange
      const req = new SearchRequest('http://example.com');
      // Act & Assert
      expect(req.validate()).toBe(true);
    });

    it('returns false for empty string', () => { // BVA: empty input boundary
      // Arrange
      const req = new SearchRequest('');
      // Act & Assert
      expect(req.validate()).toBe(false);
    });

    it('returns false for whitespace-only string', () => { // BVA: whitespace boundary
      // Arrange
      const req = new SearchRequest('   ');
      // Act & Assert
      expect(req.validate()).toBe(false);
    });
  });

  describe('getType()', () => {
    it('detects DOI type', () => { // EP: DOI detection
      // Arrange & Act
      const req = new SearchRequest('10.1000/xyz');
      // Assert
      expect(req.getType()).toBe(IdentifierType.DOI);
    });

    it('detects URL type', () => { // EP: URL detection
      // Arrange & Act
      const req = new SearchRequest('https://example.com');
      // Assert
      expect(req.getType()).toBe(IdentifierType.URL);
    });

    it('detects ISBN type', () => { // EP: ISBN detection
      // Arrange & Act
      const req = new SearchRequest('0306406152');
      // Assert
      expect(req.getType()).toBe(IdentifierType.ISBN);
    });

    it('throws for unrecognizable identifier', () => { // EP: unrecognizable input
      // Arrange
      const req = new SearchRequest('foobar');
      // Act & Assert
      expect(() => req.getType()).toThrow('Cannot determine identifier type');
    });
  });
});
