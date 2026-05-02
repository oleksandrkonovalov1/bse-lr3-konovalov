import { User } from './user.js';
import { CitationStyle, StyleName } from './citation-style.js';

export class Admin extends User {
  private readonly users: Map<string, User> = new Map();
  private readonly styles: Map<string, CitationStyle> = new Map();

  constructor(id: string, email: string) {
    super(id, email);
  }

  getRole(): string {
    return 'admin';
  }

  addUser(user: User): void {
    this.users.set(user.getId(), user);
  }

  manageUsers(): User[] {
    return [...this.users.values()];
  }

  deleteUser(userId: string): boolean {
    return this.users.delete(userId);
  }

  addStyle(name: StyleName): void {
    this.styles.set(name, new CitationStyle(name));
  }

  manageStyles(): CitationStyle[] {
    return [...this.styles.values()];
  }

  login(email: string, password: string): boolean {
    if (!email || !password) return false;
    return this.email === email && password.length >= 8;
  }
}
