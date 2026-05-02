import { describe, it, expect } from 'vitest';
import { CitationStyle } from './citation-style.js';
import { PublicationMetadata } from './types.js';

const journalArticle: PublicationMetadata = {
  title: 'Deep Learning',
  authors: ['Smith, J.', 'Jones, A.'],
  year: 2023,
  journal: 'Nature',
  volume: '521',
  issue: '7553',
  pages: '436-444',
  doi: '10.1038/nature14539',
};

const book: PublicationMetadata = {
  title: 'Clean Code',
  authors: ['Martin, R.'],
  year: 2008,
  publisher: 'Prentice Hall',
};

const minimalMetadata: PublicationMetadata = {
  title: 'Untitled Work',
  authors: [],
  year: 2024,
};

describe('CitationStyle', () => {
  describe('APA formatting', () => {
    const apa = new CitationStyle('APA');

    it('formats journal article with two authors', () => { // EP: journal article + 2 authors
      // Arrange — uses journalArticle fixture
      // Act
      const result = apa.formatCitation(journalArticle);
      // Assert
      expect(result).toContain('Smith, J., & Jones, A.');
      expect(result).toContain('(2023).');
      expect(result).toContain('Deep Learning.');
      expect(result).toContain('*Nature*');
      expect(result).toContain('https://doi.org/10.1038/nature14539');
    });

    it('formats book with single author', () => { // EP: book (no journal) + 1 author
      // Arrange — uses book fixture
      // Act
      const result = apa.formatCitation(book);
      // Assert
      expect(result).toContain('Martin, R.');
      expect(result).toContain('*Clean Code*.');
      expect(result).toContain('Prentice Hall.');
    });

    it('formats with no authors', () => { // BVA: 0 authors (boundary)
      // Arrange — uses minimalMetadata fixture
      // Act
      const result = apa.formatCitation(minimalMetadata);
      // Assert
      expect(result).toContain('(2024).');
      expect(result).toContain('*Untitled Work*.');
      expect(result).not.toMatch(/^\s*\./);
    });

    it('uses et al. for 3+ authors', () => { // BVA: 3 authors (boundary for et al.)
      // Arrange
      const meta: PublicationMetadata = {
        title: 'Study',
        authors: ['A', 'B', 'C'],
        year: 2020,
      };
      // Act
      const result = apa.formatCitation(meta);
      // Assert
      expect(result).toContain('A, et al.');
    });
  });

  describe('MLA formatting', () => {
    const mla = new CitationStyle('MLA');

    it('formats journal article', () => { // EP: MLA journal
      // Act
      const result = mla.formatCitation(journalArticle);
      // Assert
      expect(result).toContain('Smith, J.');
      expect(result).toContain('"Deep Learning."');
      expect(result).toContain('*Nature*');
      expect(result).toContain('vol. 521');
      expect(result).toContain('no. 7553');
    });

    it('formats book with publisher', () => { // EP: MLA book
      // Act
      const result = mla.formatCitation(book);
      // Assert
      expect(result).toContain('"Clean Code."');
      expect(result).toContain('Prentice Hall, 2008.');
    });
  });

  describe('Chicago formatting', () => {
    const chicago = new CitationStyle('Chicago');

    it('formats journal article with DOI', () => { // EP: Chicago journal
      // Act
      const result = chicago.formatCitation(journalArticle);
      // Assert
      expect(result).toContain('"Deep Learning."');
      expect(result).toContain('*Nature* 521');
      expect(result).toContain('(2023)');
      expect(result).toContain('https://doi.org/');
    });

    it('formats book with publisher', () => { // EP: Chicago book
      // Act
      const result = chicago.formatCitation(book);
      // Assert
      expect(result).toContain('"Clean Code."');
      expect(result).toContain('Prentice Hall, 2008.');
    });

    it('formats minimal metadata without DOI', () => { // EP: Chicago minimal
      // Act
      const result = chicago.formatCitation(minimalMetadata);
      // Assert
      expect(result).not.toContain('doi.org');
    });
  });
});
