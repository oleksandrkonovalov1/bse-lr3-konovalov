import type { Citation } from "./citation.js";
import type { CitationGenerator } from "./citation-generator.js";
import type { CitationStyle } from "./citation-style.js";
import type { SearchRequest } from "./search-request.js";
import { User } from "./user.js";

/** Зареєстрований користувач із можливістю зберігати та переглядати історію цитат */
export class RegisteredUser extends User {
	private savedCitations: Citation[] = [];
	private readonly generator: CitationGenerator;

	constructor(id: string, email: string, generator: CitationGenerator) {
		super(id, email);
		this.generator = generator;
	}

	/** Повертає роль "registered" */
	getRole(): string {
		return "registered";
	}

	/** Генерує цитату за запитом та стилем через спільний генератор */
	async generateCitation(
		request: SearchRequest,
		style: CitationStyle,
	): Promise<Citation> {
		return this.generator.generate(request, style);
	}

	/** Зберігає цитату до особистої бібліотеки; кидає помилку при дублікаті */
	saveCitation(citation: Citation): void {
		if (this.savedCitations.some((c) => c.id === citation.id)) {
			throw new Error(`Citation ${citation.id} already saved`);
		}
		this.savedCitations.push(citation);
	}

	/** Повертає копію списку збережених цитат користувача */
	getHistory(): Citation[] {
		return [...this.savedCitations];
	}

}
