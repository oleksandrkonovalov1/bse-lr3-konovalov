import type { CitationStyle } from "./citation-style.js";
import type { PublicationMetadata } from "./types.js";

/** Об'єкт цитати з метаданими, форматованим текстом та прив'язаним стилем */
export class Citation {
	private static nextId = 0;
	readonly id: string;
	readonly rawMetadata: PublicationMetadata;
	private formattedText: string;
	private style: CitationStyle;
	readonly createdAt: Date;

	constructor(metadata: PublicationMetadata, style: CitationStyle) {
		this.id = `cit-${++Citation.nextId}`;
		this.rawMetadata = metadata;
		this.style = style;
		this.formattedText = style.formatCitation(metadata);
		this.createdAt = new Date();
	}

	/** Переформатовує цитату у новому стилі та повертає оновлений текст */
	format(style: CitationStyle): string {
		this.style = style;
		this.formattedText = style.formatCitation(this.rawMetadata);
		return this.formattedText;
	}

	/** Повертає поточний форматований текст цитати */
	getFormattedText(): string {
		return this.formattedText;
	}

	/** Повертає поточний стиль цитування */
	getStyle(): CitationStyle {
		return this.style;
	}

}
