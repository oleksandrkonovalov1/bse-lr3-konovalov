import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenLibraryProvider } from './open-library-provider.js';

describe('OpenLibraryProvider', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('parses Open Library response into metadata', async () => { // Positive: successful fetch
    // Arrange
    const provider = new OpenLibraryProvider();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        'ISBN:0306406152': {
          title: 'Test Book',
          authors: [{ name: 'Author A' }],
          publish_date: '2020',
          publishers: [{ name: 'Publisher X' }],
        },
      }),
    }));
    // Act
    const metadata = await provider.fetchMetadata('0306406152');
    // Assert
    expect(metadata.title).toBe('Test Book');
    expect(metadata.authors).toEqual(['Author A']);
    expect(metadata.year).toBe(2020);
  });

  it('throws on invalid ISBN format', async () => { // EP: invalid ISBN
    // Arrange
    const provider = new OpenLibraryProvider();
    // Act & Assert
    await expect(provider.fetchMetadata('abc')).rejects.toThrow('Invalid ISBN format');
  });

  it('throws when book not found', async () => { // Negative: book not found
    // Arrange
    const provider = new OpenLibraryProvider();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }));
    // Act & Assert
    await expect(provider.fetchMetadata('0306406152')).rejects.toThrow('Book not found');
  });

  it('throws on API error', async () => { // Negative: API failure
    // Arrange
    const provider = new OpenLibraryProvider();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    // Act & Assert
    await expect(provider.fetchMetadata('0306406152')).rejects.toThrow('Open Library API error: 500');
  });
});
