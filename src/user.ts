const MIN_PASSWORD_LENGTH = 8;

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

	/** Перевіряє облікові дані користувача: email повинен збігатися, пароль — мінімум MIN_PASSWORD_LENGTH символів */
	login(email: string, password: string): boolean {
		if (!email || !password) return false;
		return this.email === email && password.length >= MIN_PASSWORD_LENGTH;
	}
}

// КОД-РЕВ'Ю: Петреченко Руслан (review-petrechenko)
// Рядок: метод login()
// Проблема: пароль перевіряється лише за довжиною без хешування — ризик безпеки
// Категорія: Security
// Рекомендація: додати хешування паролю (bcrypt) або позначити як TODO для продакшну
