import { PublicationMetadata } from './types.js';

export interface MetadataProvider {
  fetchMetadata(identifier: string): Promise<PublicationMetadata>;
}
