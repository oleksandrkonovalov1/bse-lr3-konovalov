import { IdentifierType } from './types.js';
import { SearchRequest } from './search-request.js';
import { CitationStyle } from './citation-style.js';
import { Citation } from './citation.js';
import { MetadataProvider } from './metadata-provider.js';

export class CitationGenerator {
  private readonly providers: Map<IdentifierType, MetadataProvider>;

  constructor(providers: Map<IdentifierType, MetadataProvider>) {
    if (providers.size === 0) {
      throw new Error('At least one metadata provider is required');
    }
    this.providers = providers;
  }

  async generate(
    request: SearchRequest,
    style: CitationStyle,
  ): Promise<Citation> {
    if (!request.validate()) {
      throw new Error(
        `Invalid identifier: ${request.getIdentifier()}`,
      );
    }

    const provider = this.resolveProvider(request.getType());
    const metadata = await provider.fetchMetadata(request.getIdentifier());
    return new Citation(metadata, style);
  }

  resolveProvider(type: IdentifierType): MetadataProvider {
    const provider = this.providers.get(type);
    if (!provider) {
      throw new Error(`No provider registered for type: ${type}`);
    }
    return provider;
  }
}
