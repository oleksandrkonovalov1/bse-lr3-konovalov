import { PublicationMetadata } from './types.js';

/** Інтерфейс провайдера метаданих публікації */
export interface MetadataProvider {
  /** Отримує метадані публікації за заданим ідентифікатором */
  fetchMetadata(identifier: string): Promise<PublicationMetadata>;
}
