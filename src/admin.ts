import { CitationStyle, type StyleName } from "./citation-style.js";
import { User } from "./user.js";

/** Адміністратор системи — керує користувачами та стилями цитування */
export class Admin extends User {
	private readonly users: Map<string, User> = new Map();
	private readonly styles: Map<string, CitationStyle> = new Map();

	/** Повертає роль "admin" */
	getRole(): string {
		return "admin";
	}

	/** Додає користувача до реєстру адміністратора */
	addUser(user: User): void {
		this.users.set(user.getId(), user);
	}

	/** Повертає список усіх зареєстрованих у реєстрі користувачів */
	manageUsers(): User[] {
		return [...this.users.values()];
	}

	/** Видаляє користувача з реєстру за ідентифікатором; повертає true якщо видалення успішне */
	deleteUser(userId: string): boolean {
		return this.users.delete(userId);
	}

	/** Додає новий стиль цитування до реєстру */
	addStyle(name: StyleName): void {
		this.styles.set(name, new CitationStyle(name));
	}

	/** Повертає список усіх доступних стилів цитування */
	manageStyles(): CitationStyle[] {
		return [...this.styles.values()];
	}

}
