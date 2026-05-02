# bse-lr3-konovalov

Лабораторна робота №3 з дисципліни "Основи програмної інженерії"

**Тема:** Модульне тестування програмного коду (Unit Testing)

## Автор

- **Коновалов Олександр**, група ПЗПІ-25-6, oleksandr.konovalov1@nure.ua

## Технології

- Мова: TypeScript
- Тестування: Vitest
- Покриття: @vitest/coverage-v8
- CI: GitHub Actions
- VCS: Git + GitHub

## Опис проєкту

**Система створення академічних бібліографічних посилань** — модуль для автоматичного формування бібліографічних цитат на основі ідентифікатора публікації (DOI, URL або ISBN).

Реалізовано 12 класів за UML-моделлю з ЛР 02:

| Клас | Опис |
|------|------|
| `SearchRequest` | Валідація ідентифікаторів (DOI regex, ISBN-10/13 checksum, URL) |
| `CitationStyle` | Форматування цитат у стилях APA, MLA, Chicago |
| `CitationGenerator` | Оркестрація: валідація → провайдер → форматування |
| `Citation` | Згенероване посилання з метаданими |
| `MetadataProvider` | Інтерфейс провайдера метаданих |
| `CrossrefProvider` | Метадані через Crossref API (DOI) |
| `OpenLibraryProvider` | Метадані через Open Library API (ISBN) |
| `WebScraperProvider` | Метадані через веб-скрапінг (URL) |
| `User` | Абстрактний базовий клас користувача |
| `Guest` | Гість — генерація цитат без реєстрації |
| `RegisteredUser` | Зареєстрований користувач — збереження та історія |
| `Admin` | Адміністратор — управління користувачами та стилями |

## Тестування

- **63 модульні тести** у 8 файлах
- Патерн **AAA** (Arrange — Act — Assert)
- Техніки **EP** (еквівалентне розбиття) та **BVA** (аналіз граничних значень)
- **Line coverage: 96.11%** (поріг ≥ 80%)

## Запуск

```bash
git clone https://github.com/oleksandrkonovalov1/bse-lr3-konovalov.git
cd bse-lr3-konovalov
npm install
npm test              # запуск тестів
npm run test:coverage # тести з покриттям
```

## Структура

```
bse-lr3-konovalov/
├── src/
│   ├── types.ts                    # IdentifierType, PublicationMetadata
│   ├── search-request.ts           # + search-request.test.ts
│   ├── citation-style.ts           # + citation-style.test.ts
│   ├── citation.ts                 # + citation.test.ts
│   ├── citation-generator.ts       # + citation-generator.test.ts
│   ├── metadata-provider.ts        # інтерфейс
│   ├── crossref-provider.ts        # + crossref-provider.test.ts
│   ├── open-library-provider.ts    # + open-library-provider.test.ts
│   ├── web-scraper-provider.ts     # + web-scraper-provider.test.ts
│   ├── user.ts                     # + user.test.ts (Guest, RegisteredUser, Admin)
│   ├── guest.ts
│   ├── registered-user.ts
│   ├── admin.ts
│   └── index.ts
├── reports/lr3/
│   └── report.md
├── .github/workflows/
│   └── tests.yml
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

## Ліцензія

MIT License
