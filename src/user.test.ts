import { describe, it, expect, vi } from 'vitest';
import { Guest } from './guest.js';
import { RegisteredUser } from './registered-user.js';
import { Admin } from './admin.js';
import { CitationGenerator } from './citation-generator.js';
import { Citation } from './citation.js';
import { CitationStyle } from './citation-style.js';
import { IdentifierType } from './types.js';
import type { MetadataProvider } from './metadata-provider.js';

function createGenerator(): CitationGenerator {
  const provider: MetadataProvider = {
    fetchMetadata: vi.fn().mockResolvedValue({
      title: 'Test', authors: ['A'], year: 2024,
    }),
  };
  return new CitationGenerator(new Map([[IdentifierType.DOI, provider]]));
}

describe('Guest', () => {
  it('returns "guest" role', () => { // Positive: role check
    // Arrange & Act
    const guest = new Guest(createGenerator());
    // Assert
    expect(guest.getRole()).toBe('guest');
  });

  it('has auto-generated id and empty email', () => { // Positive: constructor
    // Arrange & Act
    const guest = new Guest(createGenerator());
    // Assert
    expect(guest.getId()).toMatch(/^guest-/);
    expect(guest.getEmail()).toBe('');
  });
});

describe('RegisteredUser', () => {
  it('returns "registered" role', () => { // Positive: role check
    // Arrange & Act
    const user = new RegisteredUser('u1', 'user@test.com', createGenerator());
    // Assert
    expect(user.getRole()).toBe('registered');
  });

  it('login succeeds with correct credentials', () => { // EP: valid login
    // Arrange
    const user = new RegisteredUser('u1', 'user@test.com', createGenerator());
    // Act & Assert
    expect(user.login('user@test.com', 'password123')).toBe(true);
  });

  it('login fails with wrong email', () => { // EP: wrong email
    // Arrange
    const user = new RegisteredUser('u1', 'user@test.com', createGenerator());
    // Act & Assert
    expect(user.login('wrong@test.com', 'password123')).toBe(false);
  });

  it('login fails with short password', () => { // BVA: password length boundary (7 chars)
    // Arrange
    const user = new RegisteredUser('u1', 'user@test.com', createGenerator());
    // Act & Assert
    expect(user.login('user@test.com', '1234567')).toBe(false);
  });

  it('login succeeds with exactly 8-char password', () => { // BVA: password length boundary (8 chars)
    // Arrange
    const user = new RegisteredUser('u1', 'user@test.com', createGenerator());
    // Act & Assert
    expect(user.login('user@test.com', '12345678')).toBe(true);
  });

  it('login fails with empty email', () => { // EP: empty credentials
    // Arrange
    const user = new RegisteredUser('u1', 'user@test.com', createGenerator());
    // Act & Assert
    expect(user.login('', 'password123')).toBe(false);
  });

  it('saves citation and retrieves history', () => { // Positive: save + history
    // Arrange
    const user = new RegisteredUser('u1', 'user@test.com', createGenerator());
    const citation = new Citation(
      { title: 'T', authors: [], year: 2024 },
      new CitationStyle('APA'),
    );
    // Act
    user.saveCitation(citation);
    // Assert
    expect(user.getHistory()).toHaveLength(1);
    expect(user.getHistory()[0].id).toBe(citation.id);
  });

  it('throws when saving duplicate citation', () => { // Negative: duplicate save
    // Arrange
    const user = new RegisteredUser('u1', 'user@test.com', createGenerator());
    const citation = new Citation(
      { title: 'T', authors: [], year: 2024 },
      new CitationStyle('APA'),
    );
    user.saveCitation(citation);
    // Act & Assert
    expect(() => user.saveCitation(citation)).toThrow('already saved');
  });

  it('returns empty history initially', () => { // BVA: empty history boundary
    // Arrange
    const user = new RegisteredUser('u1', 'user@test.com', createGenerator());
    // Act & Assert
    expect(user.getHistory()).toEqual([]);
  });
});

describe('Admin', () => {
  it('returns "admin" role', () => { // Positive: role check
    // Arrange & Act
    const admin = new Admin('a1', 'admin@test.com');
    // Assert
    expect(admin.getRole()).toBe('admin');
  });

  it('adds and lists users', () => { // Positive: user management
    // Arrange
    const admin = new Admin('a1', 'admin@test.com');
    const guest = new Guest(createGenerator());
    // Act
    admin.addUser(guest);
    // Assert
    expect(admin.manageUsers()).toHaveLength(1);
  });

  it('deletes existing user', () => { // Positive: delete user
    // Arrange
    const admin = new Admin('a1', 'admin@test.com');
    const guest = new Guest(createGenerator());
    admin.addUser(guest);
    // Act
    const result = admin.deleteUser(guest.getId());
    // Assert
    expect(result).toBe(true);
    expect(admin.manageUsers()).toHaveLength(0);
  });

  it('returns false when deleting non-existent user', () => { // Negative: delete unknown user
    // Arrange
    const admin = new Admin('a1', 'admin@test.com');
    // Act & Assert
    expect(admin.deleteUser('unknown-id')).toBe(false);
  });

  it('adds and lists styles', () => { // Positive: style management
    // Arrange
    const admin = new Admin('a1', 'admin@test.com');
    // Act
    admin.addStyle('APA');
    admin.addStyle('MLA');
    // Assert
    expect(admin.manageStyles()).toHaveLength(2);
  });

  it('login works with correct credentials', () => { // EP: valid admin login
    // Arrange
    const admin = new Admin('a1', 'admin@test.com');
    // Act & Assert
    expect(admin.login('admin@test.com', 'adminpass')).toBe(true);
  });
});
