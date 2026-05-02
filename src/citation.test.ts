import { describe, it, expect } from 'vitest';
import { Citation } from './citation.js';
import { CitationStyle } from './citation-style.js';
import { PublicationMetadata } from './types.js';

const metadata: PublicationMetadata = {
  title: 'Test Article',
  authors: ['Author, A.'],
  year: 2024,
  journal: 'Journal',
};

describe('Citation', () => {
  it('creates citation with formatted text', () => { // Positive: constructor
    // Arrange
    const style = new CitationStyle('APA');
    // Act
    const citation = new Citation(metadata, style);
    // Assert
    expect(citation.getFormattedText()).toContain('Test Article');
    expect(citation.getStyle().name).toBe('APA');
    expect(citation.id).toBeDefined();
    expect(citation.createdAt).toBeInstanceOf(Date);
  });

  it('re-formats citation with different style', () => { // Positive: format()
    // Arrange
    const citation = new Citation(metadata, new CitationStyle('APA'));
    // Act
    const result = citation.format(new CitationStyle('MLA'));
    // Assert
    expect(result).toContain('"Test Article."');
    expect(citation.getStyle().name).toBe('MLA');
  });

  it('copyToClipboard returns formatted text', () => { // Positive: copyToClipboard()
    // Arrange
    const citation = new Citation(metadata, new CitationStyle('APA'));
    // Act
    const text = citation.copyToClipboard();
    // Assert
    expect(text).toBe(citation.getFormattedText());
  });

  it('stores raw metadata unchanged', () => { // Positive: rawMetadata preservation
    // Arrange & Act
    const citation = new Citation(metadata, new CitationStyle('APA'));
    // Assert
    expect(citation.rawMetadata).toEqual(metadata);
  });
});
