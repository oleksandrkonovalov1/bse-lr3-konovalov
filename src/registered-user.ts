import { User } from './user.js';
import { SearchRequest } from './search-request.js';
import { CitationStyle } from './citation-style.js';
import { Citation } from './citation.js';
import { CitationGenerator } from './citation-generator.js';

export class RegisteredUser extends User {
  private savedCitations: Citation[] = [];
  private readonly generator: CitationGenerator;

  constructor(id: string, email: string, generator: CitationGenerator) {
    super(id, email);
    this.generator = generator;
  }

  getRole(): string {
    return 'registered';
  }

  async generateCitation(
    request: SearchRequest,
    style: CitationStyle,
  ): Promise<Citation> {
    return this.generator.generate(request, style);
  }

  saveCitation(citation: Citation): void {
    if (this.savedCitations.some((c) => c.id === citation.id)) {
      throw new Error(`Citation ${citation.id} already saved`);
    }
    this.savedCitations.push(citation);
  }

  getHistory(): Citation[] {
    return [...this.savedCitations];
  }

  login(email: string, password: string): boolean {
    if (!email || !password) return false;
    return this.email === email && password.length >= 8;
  }
}
