import { User } from './user.js';
import { SearchRequest } from './search-request.js';
import { CitationStyle } from './citation-style.js';
import { Citation } from './citation.js';
import { CitationGenerator } from './citation-generator.js';

export class Guest extends User {
  private readonly generator: CitationGenerator;

  constructor(generator: CitationGenerator) {
    super(`guest-${Date.now()}`, '');
    this.generator = generator;
  }

  getRole(): string {
    return 'guest';
  }

  async generateCitation(
    request: SearchRequest,
    style: CitationStyle,
  ): Promise<Citation> {
    return this.generator.generate(request, style);
  }
}
