export abstract class User {
  protected readonly id: string;
  protected readonly email: string;

  constructor(id: string, email: string) {
    this.id = id;
    this.email = email;
  }

  abstract getRole(): string;

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }
}
