# Звіт з лабораторної роботи № 3

## Основи програмної інженерії

---

**Дисципліна:** Основи програмної інженерії

**Тема:** Модульне тестування програмного коду (Unit Testing)

**Виконав:** студент групи ПЗПІ-25-6 **Коновалов Олександр**

**Email:** oleksandr.konovalov1@nure.ua

**Репозиторій:** https://github.com/oleksandrkonovalov1/bse-lr3-konovalov

---

## 1. Тема та мета

**Тема:** Модульне тестування програмного коду

**Мета:** Набуття практичних навичок із написання модульних тестів з використанням фреймворку Vitest. Оволодіння техніками проєктування тестів — еквівалентне розбиття (EP) та аналіз граничних значень (BVA). Досягнення line coverage ≥ 80%.

---

## 2. Вихідний код модуля

Модуль реалізує систему створення академічних бібліографічних посилань на основі UML-моделі з ЛР 02. Мова: TypeScript. 12 класів, 3+ методи з нетривіальною логікою.

### Ключові класи з нетривіальною логікою

#### SearchRequest (`src/search-request.ts`)

Валідація ідентифікаторів публікацій (DOI, ISBN-10/13, URL) з перевіркою контрольних сум ISBN.

```typescript
validate(): boolean {
  if (!this.identifier || !this.type) return false;
  switch (this.type) {
    case IdentifierType.DOI:
      return /^10\.\d{4,}\/\S+$/.test(this.identifier);
    case IdentifierType.ISBN:
      return this.isValidIsbn();
    case IdentifierType.URL:
      try {
        const url = new URL(this.identifier);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch { return false; }
  }
}
```

#### CitationStyle (`src/citation-style.ts`)

Форматування цитат у стилях APA, MLA, Chicago з різною логікою обробки авторів та метаданих.

```typescript
formatCitation(metadata: PublicationMetadata): string {
  switch (this.name) {
    case 'APA': return this.formatApa(metadata);
    case 'MLA': return this.formatMla(metadata);
    case 'Chicago': return this.formatChicago(metadata);
  }
}
```

#### CitationGenerator (`src/citation-generator.ts`)

Оркестрація: валідація запиту → маршрутизація до провайдера → отримання метаданих → створення цитати.

```typescript
async generate(request: SearchRequest, style: CitationStyle): Promise<Citation> {
  if (!request.validate()) {
    throw new Error(`Invalid identifier: ${request.getIdentifier()}`);
  }
  const provider = this.resolveProvider(request.getType());
  const metadata = await provider.fetchMetadata(request.getIdentifier());
  return new Citation(metadata, style);
}
```

Повний вихідний код: [GitHub](https://github.com/oleksandrkonovalov1/bse-lr3-konovalov/tree/main/src)

---

## 3. Таблиця проєктування тестів

### SearchRequest.validate()

| Тест-кейс | Вхідні дані | Очікуваний результат | Техніка | Статус |
|-----------|-------------|---------------------|---------|--------|
| Валідний DOI | `10.1000/xyz` | `true` | EP | pass |
| DOI зі складним суфіксом | `10.1038/s41586-021-03819-2` | `true` | EP | pass |
| DOI з коротким реєстрантом | `10.1/x` | `false` | BVA | pass |
| Мінімальний валідний DOI | `10.1000/x` | `true` | BVA | pass |
| Валідний ISBN-13 з дефісами | `978-3-16-148410-0` | `true` | EP | pass |
| Валідний ISBN-10 | `0306406152` | `true` | EP | pass |
| ISBN-13 з невірною контрольною сумою | `978-3-16-148410-1` | `false` | EP | pass |
| Валідний HTTPS URL | `https://example.com/article` | `true` | EP | pass |
| Валідний HTTP URL | `http://example.com` | `true` | EP | pass |
| Порожній рядок | `""` | `false` | BVA | pass |
| Рядок з пробілів | `"   "` | `false` | BVA | pass |

### SearchRequest.getType()

| Тест-кейс | Вхідні дані | Очікуваний результат | Техніка | Статус |
|-----------|-------------|---------------------|---------|--------|
| Визначення DOI | `10.1000/xyz` | `IdentifierType.DOI` | EP | pass |
| Визначення URL | `https://example.com` | `IdentifierType.URL` | EP | pass |
| Визначення ISBN | `0306406152` | `IdentifierType.ISBN` | EP | pass |
| Нерозпізнаний ідентифікатор | `foobar` | throws Error | EP | pass |

### CitationStyle.formatCitation()

| Тест-кейс | Вхідні дані | Очікуваний результат | Техніка | Статус |
|-----------|-------------|---------------------|---------|--------|
| APA: журнальна стаття, 2 автори | journal + 2 authors | Формат APA з `&` | EP | pass |
| APA: книга, 1 автор | book + 1 author | Курсив назви, видавець | EP | pass |
| APA: без авторів | 0 authors | Без префіксу автора | BVA | pass |
| APA: 3+ авторів | 3 authors | `et al.` | BVA | pass |
| MLA: журнальна стаття | journal article | `vol.`, `no.` | EP | pass |
| MLA: книга | book + publisher | Видавець, рік | EP | pass |
| Chicago: стаття з DOI | journal + DOI | `doi.org` посилання | EP | pass |
| Chicago: книга | book + publisher | Видавець, рік | EP | pass |
| Chicago: мінімальні дані | no DOI | Без DOI посилання | EP | pass |

### CitationGenerator

| Тест-кейс | Вхідні дані | Очікуваний результат | Техніка | Статус |
|-----------|-------------|---------------------|---------|--------|
| Порожня мапа провайдерів | `new Map()` | throws Error | BVA | pass |
| Зареєстрований тип | DOI type | Повертає провайдер | EP | pass |
| Незареєстрований тип | ISBN (не зареєстрований) | throws Error | EP | pass |
| Генерація для валідного запиту | DOI + APA | Citation об'єкт | Positive | pass |
| Невалідний ідентифікатор | `invalid` | throws Error | Negative | pass |
| Помилка провайдера | mock reject | throws Error | Negative | pass |

### Providers (CrossrefProvider, OpenLibraryProvider, WebScraperProvider)

| Тест-кейс | Вхідні дані | Очікуваний результат | Техніка | Статус |
|-----------|-------------|---------------------|---------|--------|
| Crossref: успішний запит | mock API response | PublicationMetadata | Positive | pass |
| Crossref: невалідний DOI | `invalid` | throws Error | EP | pass |
| Crossref: помилка API | 404 response | throws Error | Negative | pass |
| Crossref: неповні дані | empty message | defaults (Unknown, [], 0) | EP | pass |
| OpenLibrary: успішний запит | mock API response | PublicationMetadata | Positive | pass |
| OpenLibrary: невалідний ISBN | `abc` | throws Error | EP | pass |
| OpenLibrary: книга не знайдена | empty response | throws Error | Negative | pass |
| OpenLibrary: помилка API | 500 response | throws Error | Negative | pass |
| WebScraper: витягує title | HTML з `<title>` | Title text | Positive | pass |
| WebScraper: без title тегу | HTML без `<title>` | `Unknown` | EP | pass |
| WebScraper: невалідний URL | `not-a-url` | throws Error | EP | pass |
| WebScraper: помилка HTTP | 403 response | throws Error | Negative | pass |

### User Hierarchy (Guest, RegisteredUser, Admin)

| Тест-кейс | Вхідні дані | Очікуваний результат | Техніка | Статус |
|-----------|-------------|---------------------|---------|--------|
| Guest: роль | — | `guest` | Positive | pass |
| Guest: автогенерований id | — | matches `/^guest-/` | Positive | pass |
| RegisteredUser: роль | — | `registered` | Positive | pass |
| Login: вірні дані | correct email + 8+ chars | `true` | EP | pass |
| Login: невірний email | wrong email | `false` | EP | pass |
| Login: пароль 7 символів | 7-char password | `false` | BVA | pass |
| Login: пароль 8 символів | 8-char password | `true` | BVA | pass |
| Login: порожній email | empty email | `false` | EP | pass |
| Збереження цитати | Citation object | history length = 1 | Positive | pass |
| Дублікат цитати | same Citation twice | throws Error | Negative | pass |
| Порожня історія | — | `[]` | BVA | pass |
| Admin: роль | — | `admin` | Positive | pass |
| Admin: додавання користувача | Guest object | manageUsers length = 1 | Positive | pass |
| Admin: видалення користувача | existing userId | `true`, length = 0 | Positive | pass |
| Admin: видалення неіснуючого | unknown userId | `false` | Negative | pass |
| Admin: додавання стилів | APA + MLA | manageStyles length = 2 | Positive | pass |
| Admin: login | correct credentials | `true` | EP | pass |

---

## 4. Вихідний код тестів

Тести написані з використанням фреймворку **Vitest**. Кожен тест відповідає патерну **AAA** (Arrange — Act — Assert) та містить коментар із зазначенням техніки (EP/BVA/Positive/Negative).

Повний код тестів: [GitHub](https://github.com/oleksandrkonovalov1/bse-lr3-konovalov/tree/main/src) (файли `*.test.ts`)

Загальна кількість тестів: **63**

| Файл | Тести |
|------|-------|
| `search-request.test.ts` | 15 |
| `citation-style.test.ts` | 9 |
| `citation.test.ts` | 4 |
| `citation-generator.test.ts` | 6 |
| `crossref-provider.test.ts` | 4 |
| `open-library-provider.test.ts` | 4 |
| `web-scraper-provider.test.ts` | 4 |
| `user.test.ts` | 17 |

---

## 5. Покриття коду

```
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |   96.11 |     94.8 |   96.61 |   96.11 |
 admin.ts          |     100 |       90 |     100 |     100 | 45
 ...n-generator.ts |     100 |      100 |     100 |     100 |
 citation-style.ts |    97.5 |    97.22 |     100 |    97.5 | 14-15
 citation.ts       |     100 |      100 |     100 |     100 |
 ...ef-provider.ts |     100 |      100 |     100 |     100 |
 guest.ts          |   70.58 |      100 |      75 |   70.58 | 23-27
 ...ta-provider.ts |       0 |        0 |       0 |       0 |
 ...ry-provider.ts |     100 |    78.57 |     100 |     100 | 32-34
 ...stered-user.ts |   83.87 |      100 |   85.71 |   83.87 | 24-28
 search-request.ts |   95.31 |     90.9 |     100 |   95.31 | 27-28,57
 types.ts          |     100 |      100 |     100 |     100 |
 user.ts           |     100 |      100 |     100 |     100 |
 ...er-provider.ts |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|-------------------
```

**Line coverage: 96.11%** (поріг ≥ 80% — виконано)

HTML-звіт: `coverage/index.html`

---

## 6. Посилання

- **Репозиторій:** https://github.com/oleksandrkonovalov1/bse-lr3-konovalov
- **CI:** GitHub Actions автоматично запускає тести на кожен push та pull request

---

## 7. Висновки

У ході виконання лабораторної роботи було:

1. **Реалізовано програмний модуль** — 12 класів системи бібліографічних посилань на TypeScript, з нетривіальною логікою в методах `validate()`, `formatCitation()`, `generate()`.

2. **Спроєктовано тест-кейси** з використанням технік EP та BVA:
   - Еквівалентне розбиття дозволило систематично покрити основні класи вхідних даних (валідні/невалідні DOI, ISBN, URL; різні стилі цитування; різна кількість авторів)
   - Аналіз граничних значень виявив критичні межі (мінімальний DOI, ISBN-10/13, пароль 7/8 символів, порожні вхідні дані)

3. **Написано 63 модульні тести** з використанням Vitest, кожен за патерном AAA з коментарем техніки.

4. **Досягнуто line coverage 96.11%**, що значно перевищує пороговий рівень 80%. Непокриті рядки — переважно делегуючі методи (`generateCitation()` у Guest та RegisteredUser) та інтерфейс `MetadataProvider` (не має runtime-коду).

5. **Налаштовано CI** через GitHub Actions для автоматичного запуску тестів.

**Виявлені спостереження:**
- Мокування `fetch` через `vi.stubGlobal()` дозволяє ізольовано тестувати провайдери без мережевих запитів
- Патерн AAA забезпечує чітку структуру тестів та їх читабельність
- Техніки EP та BVA доповнюють одна одну: EP визначає категорії, BVA — критичні точки всередині них
