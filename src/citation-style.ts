import { PublicationMetadata } from './types.js';

export type StyleName = 'APA' | 'MLA' | 'Chicago';

const VALID_STYLES: StyleName[] = ['APA', 'MLA', 'Chicago'];

/** Стиль цитування (APA, MLA або Chicago) з логікою форматування метаданих */
export class CitationStyle {
  readonly name: StyleName;
  readonly template: string;

  constructor(name: StyleName) {
    if (!VALID_STYLES.includes(name)) {
      throw new Error(`Unknown citation style: ${name}`);
    }
    this.name = name;
    this.template = name;
  }

  /** Форматує метадані публікації у рядок цитати відповідно до обраного стилю */
  formatCitation(metadata: PublicationMetadata): string {
    switch (this.name) {
      case 'APA':
        return this.formatApa(metadata);
      case 'MLA':
        return this.formatMla(metadata);
      case 'Chicago':
        return this.formatChicago(metadata);
    }
  }

  private formatAuthorsApa(authors: string[]): string {
    if (authors.length === 0) return '';
    if (authors.length === 1) return `${authors[0]}.`;
    if (authors.length === 2) return `${authors[0]}, & ${authors[1]}.`;
    return `${authors[0]}, et al.`;
  }

  private formatApa(m: PublicationMetadata): string {
    const parts: string[] = [];

    const authorsStr = this.formatAuthorsApa(m.authors);
    if (authorsStr) parts.push(authorsStr);

    parts.push(`(${m.year}).`);

    if (m.journal) {
      parts.push(`${m.title}.`);
      let journalPart = `*${m.journal}*`;
      if (m.volume) journalPart += `, *${m.volume}*`;
      if (m.issue) journalPart += `(${m.issue})`;
      if (m.pages) journalPart += `, ${m.pages}`;
      parts.push(`${journalPart}.`);
    } else {
      parts.push(`*${m.title}*.`);
    }

    if (m.publisher) parts.push(`${m.publisher}.`);
    if (m.doi) parts.push(`https://doi.org/${m.doi}`);

    return parts.join(' ');
  }

  private formatMla(m: PublicationMetadata): string {
    const parts: string[] = [];

    if (m.authors.length > 0) parts.push(`${m.authors[0]}.`);

    parts.push(`"${m.title}."`);

    if (m.journal) {
      let journalPart = `*${m.journal}*`;
      if (m.volume) journalPart += `, vol. ${m.volume}`;
      if (m.issue) journalPart += `, no. ${m.issue}`;
      journalPart += `, ${m.year}`;
      if (m.pages) journalPart += `, pp. ${m.pages}`;
      parts.push(`${journalPart}.`);
    } else if (m.publisher) {
      parts.push(`${m.publisher}, ${m.year}.`);
    }

    return parts.join(' ');
  }

  private formatChicago(m: PublicationMetadata): string {
    const parts: string[] = [];

    if (m.authors.length > 0) parts.push(`${m.authors[0]}.`);

    parts.push(`"${m.title}."`);

    if (m.journal) {
      let journalPart = `*${m.journal}*`;
      if (m.volume) journalPart += ` ${m.volume}`;
      if (m.issue) journalPart += `, no. ${m.issue}`;
      journalPart += ` (${m.year})`;
      if (m.pages) journalPart += `: ${m.pages}`;
      parts.push(`${journalPart}.`);
    } else if (m.publisher) {
      parts.push(`${m.publisher}, ${m.year}.`);
    }

    if (m.doi) parts.push(`https://doi.org/${m.doi}`);

    return parts.join(' ');
  }
}
