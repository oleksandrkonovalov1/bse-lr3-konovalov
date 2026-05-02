import { MetadataProvider } from './metadata-provider.js';
import { PublicationMetadata } from './types.js';

/** Провайдер метаданих для DOI через Crossref API */
export class CrossrefProvider implements MetadataProvider {
  private readonly apiUrl: string;

  constructor(apiUrl: string = 'https://api.crossref.org/works') {
    this.apiUrl = apiUrl;
  }

  async fetchMetadata(identifier: string): Promise<PublicationMetadata> {
    if (!identifier.startsWith('10.')) {
      throw new Error(`Invalid DOI format: ${identifier}`);
    }

    const response = await fetch(`${this.apiUrl}/${identifier}`);
    if (!response.ok) {
      throw new Error(`Crossref API error: ${response.status}`);
    }

    const data = await response.json();
    const item = data.message;

    return {
      title: item.title?.[0] ?? 'Unknown',
      authors: (item.author ?? []).map(
        (a: { family?: string; given?: string }) =>
          [a.family, a.given].filter(Boolean).join(', '),
      ),
      year: item.published?.['date-parts']?.[0]?.[0] ?? 0,
      journal: item['container-title']?.[0],
      volume: item.volume,
      issue: item.issue,
      pages: item.page,
      doi: identifier,
      publisher: item.publisher,
    };
  }
}
