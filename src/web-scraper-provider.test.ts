import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WebScraperProvider } from './web-scraper-provider.js';

describe('WebScraperProvider', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('extracts title from HTML page', async () => { // Positive: title extraction
    // Arrange
    const provider = new WebScraperProvider();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: async () => '<html><title>Page Title</title><body></body></html>',
    }));
    // Act
    const metadata = await provider.fetchMetadata('https://example.com');
    // Assert
    expect(metadata.title).toBe('Page Title');
    expect(metadata.url).toBe('https://example.com');
  });

  it('returns "Unknown" when no title tag', async () => { // EP: missing title
    // Arrange
    const provider = new WebScraperProvider();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: async () => '<html><body>No title here</body></html>',
    }));
    // Act
    const metadata = await provider.fetchMetadata('https://example.com');
    // Assert
    expect(metadata.title).toBe('Unknown');
  });

  it('throws on invalid URL', async () => { // EP: invalid URL
    // Arrange
    const provider = new WebScraperProvider();
    // Act & Assert
    await expect(provider.fetchMetadata('not-a-url')).rejects.toThrow('Invalid URL');
  });

  it('throws on fetch failure', async () => { // Negative: HTTP error
    // Arrange
    const provider = new WebScraperProvider();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    // Act & Assert
    await expect(provider.fetchMetadata('https://example.com')).rejects.toThrow('Failed to fetch URL: 403');
  });
});
