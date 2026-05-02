import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CrossrefProvider } from './crossref-provider.js';

describe('CrossrefProvider', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('parses Crossref API response into metadata', async () => { // Positive: successful fetch
    // Arrange
    const provider = new CrossrefProvider();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: {
          title: ['Test Article'],
          author: [{ family: 'Smith', given: 'John' }],
          published: { 'date-parts': [[2023]] },
          'container-title': ['Nature'],
          volume: '1',
          publisher: 'Springer',
        },
      }),
    }));
    // Act
    const metadata = await provider.fetchMetadata('10.1000/test');
    // Assert
    expect(metadata.title).toBe('Test Article');
    expect(metadata.authors).toEqual(['Smith, John']);
    expect(metadata.year).toBe(2023);
    expect(metadata.journal).toBe('Nature');
  });

  it('throws on invalid DOI format', async () => { // EP: invalid DOI
    // Arrange
    const provider = new CrossrefProvider();
    // Act & Assert
    await expect(provider.fetchMetadata('invalid')).rejects.toThrow('Invalid DOI format');
  });

  it('throws on API error response', async () => { // Negative: API failure
    // Arrange
    const provider = new CrossrefProvider();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    // Act & Assert
    await expect(provider.fetchMetadata('10.1000/test')).rejects.toThrow('Crossref API error: 404');
  });

  it('handles missing fields gracefully', async () => { // EP: sparse API response
    // Arrange
    const provider = new CrossrefProvider();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: {} }),
    }));
    // Act
    const metadata = await provider.fetchMetadata('10.1000/test');
    // Assert
    expect(metadata.title).toBe('Unknown');
    expect(metadata.authors).toEqual([]);
    expect(metadata.year).toBe(0);
  });
});
