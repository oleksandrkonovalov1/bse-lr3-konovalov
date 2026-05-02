export enum IdentifierType {
  DOI = 'DOI',
  ISBN = 'ISBN',
  URL = 'URL',
}

export interface PublicationMetadata {
  title: string;
  authors: string[];
  year: number;
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  isbn?: string;
  url?: string;
}
