import { User } from './user.js';
import { SearchRequest } from './search-request.js';
import { CitationStyle } from './citation-style.js';
import { Citation } from './citation.js';
import { CitationGenerator } from './citation-generator.js';

/** Гостьовий користувач — може генерувати цитати без реєстрації */
export class Guest extends User {
  private readonly generator: CitationGenerator;

  constructor(generator: CitationGenerator) {
    super(`guest-${Date.now()}`, '');
    this.generator = generator;
  }

  /** Повертає роль "guest" */
  getRole(): string {
    return 'guest';
  }

  /** Генерує цитату за запитом та стилем через спільний генератор */
  async generateCitation(
    request: SearchRequest,
    style: CitationStyle,
  ): Promise<Citation> {
    return this.generator.generate(request, style);
  }
}
