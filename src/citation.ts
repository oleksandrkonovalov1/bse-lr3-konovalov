import { CitationStyle } from './citation-style.js';
import { PublicationMetadata } from './types.js';

let idCounter = 0;

export class Citation {
  readonly id: string;
  readonly rawMetadata: PublicationMetadata;
  private formattedText: string;
  private style: CitationStyle;
  readonly createdAt: Date;

  constructor(metadata: PublicationMetadata, style: CitationStyle) {
    this.id = `cit-${++idCounter}`;
    this.rawMetadata = metadata;
    this.style = style;
    this.formattedText = style.formatCitation(metadata);
    this.createdAt = new Date();
  }

  format(style: CitationStyle): string {
    this.style = style;
    this.formattedText = style.formatCitation(this.rawMetadata);
    return this.formattedText;
  }

  getFormattedText(): string {
    return this.formattedText;
  }

  getStyle(): CitationStyle {
    return this.style;
  }

  copyToClipboard(): string {
    return this.formattedText;
  }
}
