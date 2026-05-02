import { MetadataProvider } from './metadata-provider.js';
import { PublicationMetadata } from './types.js';

/** Провайдер метаданих для URL через HTTP-запит і парсинг HTML-заголовку */
export class WebScraperProvider implements MetadataProvider {
  async fetchMetadata(url: string): Promise<PublicationMetadata> {
    try {
      new URL(url);
    } catch {
      throw new Error(`Invalid URL: ${url}`);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();
    const title = this.extractTitle(html);

    return {
      title,
      authors: [],
      year: new Date().getFullYear(),
      url,
    };
  }

  private extractTitle(html: string): string {
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match ? match[1].trim() : 'Unknown';
  }
}
