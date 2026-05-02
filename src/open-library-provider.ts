import { MetadataProvider } from './metadata-provider.js';
import { PublicationMetadata } from './types.js';

/** Провайдер метаданих для ISBN через Open Library API */
export class OpenLibraryProvider implements MetadataProvider {
  private readonly apiUrl: string;

  constructor(apiUrl: string = 'https://openlibrary.org/api/books') {
    this.apiUrl = apiUrl;
  }

  async fetchMetadata(identifier: string): Promise<PublicationMetadata> {
    const cleaned = identifier.replace(/[-\s]/g, '');
    if (!/^\d{10}(\d{3})?$/.test(cleaned)) {
      throw new Error(`Invalid ISBN format: ${identifier}`);
    }

    const response = await fetch(
      `${this.apiUrl}?bibkeys=ISBN:${cleaned}&format=json&jscmd=data`,
    );
    if (!response.ok) {
      throw new Error(`Open Library API error: ${response.status}`);
    }

    const data = await response.json();
    const book = data[`ISBN:${cleaned}`];
    if (!book) {
      throw new Error(`Book not found for ISBN: ${identifier}`);
    }

    return {
      title: book.title ?? 'Unknown',
      authors: (book.authors ?? []).map((a: { name: string }) => a.name),
      year: book.publish_date ? parseInt(book.publish_date, 10) : 0,
      publisher: book.publishers?.[0]?.name,
      isbn: identifier,
    };
  }
}
