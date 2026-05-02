/** Абстрактний базовий клас користувача системи цитування */
export abstract class User {
  protected readonly id: string;
  protected readonly email: string;

  constructor(id: string, email: string) {
    this.id = id;
    this.email = email;
  }

  /** Повертає роль користувача (guest, registered або admin) */
  abstract getRole(): string;

  /** Повертає унікальний ідентифікатор користувача */
  getId(): string {
    return this.id;
  }

  /** Повертає email-адресу користувача */
  getEmail(): string {
    return this.email;
  }
}
