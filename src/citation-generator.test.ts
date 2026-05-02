import { describe, it, expect, vi } from 'vitest';
import { CitationGenerator } from './citation-generator.js';
import { SearchRequest } from './search-request.js';
import { CitationStyle } from './citation-style.js';
import { IdentifierType } from './types.js';
import type { MetadataProvider } from './metadata-provider.js';

function mockProvider(): MetadataProvider {
  return {
    fetchMetadata: vi.fn().mockResolvedValue({
      title: 'Mock Article',
      authors: ['Mock Author'],
      year: 2024,
    }),
  };
}

describe('CitationGenerator', () => {
  it('throws when created with empty providers map', () => { // BVA: empty providers boundary
    // Arrange & Act & Assert
    expect(() => new CitationGenerator(new Map())).toThrow('At least one metadata provider is required');
  });

  describe('resolveProvider()', () => {
    it('returns provider for registered type', () => { // EP: registered type
      // Arrange
      const doiProvider = mockProvider();
      const gen = new CitationGenerator(new Map([[IdentifierType.DOI, doiProvider]]));
      // Act
      const result = gen.resolveProvider(IdentifierType.DOI);
      // Assert
      expect(result).toBe(doiProvider);
    });

    it('throws for unregistered type', () => { // EP: unregistered type
      // Arrange
      const gen = new CitationGenerator(new Map([[IdentifierType.DOI, mockProvider()]]));
      // Act & Assert
      expect(() => gen.resolveProvider(IdentifierType.ISBN)).toThrow('No provider registered for type: ISBN');
    });
  });

  describe('generate()', () => {
    it('generates citation for valid request', async () => { // Positive: full flow
      // Arrange
      const provider = mockProvider();
      const gen = new CitationGenerator(new Map([[IdentifierType.DOI, provider]]));
      const request = new SearchRequest('10.1000/test');
      const style = new CitationStyle('APA');
      // Act
      const citation = await gen.generate(request, style);
      // Assert
      expect(citation.rawMetadata.title).toBe('Mock Article');
      expect(citation.getStyle().name).toBe('APA');
      expect(provider.fetchMetadata).toHaveBeenCalledWith('10.1000/test');
    });

    it('throws for invalid identifier', async () => { // Negative: validation failure
      // Arrange
      const gen = new CitationGenerator(new Map([[IdentifierType.DOI, mockProvider()]]));
      const request = new SearchRequest('invalid');
      const style = new CitationStyle('APA');
      // Act & Assert
      await expect(gen.generate(request, style)).rejects.toThrow('Invalid identifier');
    });

    it('propagates provider errors', async () => { // Negative: provider failure
      // Arrange
      const failingProvider: MetadataProvider = {
        fetchMetadata: vi.fn().mockRejectedValue(new Error('API down')),
      };
      const gen = new CitationGenerator(new Map([[IdentifierType.DOI, failingProvider]]));
      const request = new SearchRequest('10.1000/test');
      const style = new CitationStyle('APA');
      // Act & Assert
      await expect(gen.generate(request, style)).rejects.toThrow('API down');
    });
  });
});
