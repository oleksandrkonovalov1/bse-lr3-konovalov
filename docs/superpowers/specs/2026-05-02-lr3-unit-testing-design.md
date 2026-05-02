# ЛР 03 — Модульне тестування: Design Spec

## Context

Lab 3 for "Основи програмної інженерії" — unit testing the citation system module implemented in TypeScript based on the UML class diagram from LR 02.

- **Repo:** `oleksandrkonovalov1/bse-lr3-konovalov` at `~/Projects/nure-se/bse-lr3-konovalov/`
- **Submodule:** `courses/fundamentals-of-se/labs/lab_03/`
- **Stack:** TypeScript + Vitest + @vitest/coverage-v8
- **Deadline:** June 5, 2026

## Module (already implemented)

12 classes mapped 1:1 from UML class diagram:

| Class | File | Key methods |
|-------|------|-------------|
| IdentifierType | `src/types.ts` | enum (DOI, ISBN, URL) |
| PublicationMetadata | `src/types.ts` | interface |
| SearchRequest | `src/search-request.ts` | `validate()`, `getType()`, ISBN checksums |
| CitationStyle | `src/citation-style.ts` | `formatCitation()` — APA/MLA/Chicago |
| Citation | `src/citation.ts` | `format()`, `copyToClipboard()` |
| MetadataProvider | `src/metadata-provider.ts` | interface |
| CrossrefProvider | `src/crossref-provider.ts` | `fetchMetadata()` — Crossref API |
| OpenLibraryProvider | `src/open-library-provider.ts` | `fetchMetadata()` — Open Library API |
| WebScraperProvider | `src/web-scraper-provider.ts` | `fetchMetadata()` + `extractTitle()` |
| CitationGenerator | `src/citation-generator.ts` | `generate()`, `resolveProvider()` |
| User (abstract) | `src/user.ts` | `getRole()` |
| Guest | `src/guest.ts` | `generateCitation()` |
| RegisteredUser | `src/registered-user.ts` | `saveCitation()`, `getHistory()`, `login()` |
| Admin | `src/admin.ts` | `manageUsers()`, `deleteUser()`, `manageStyles()`, `login()` |

## Testing Design

### Approach

- One test file per source file, co-located in `src/`
- All classes tested (not just the minimum 3)
- AAA pattern (Arrange — Act — Assert) for every test
- Comment on each test with technique: EP/BVA/positive/negative
- Mock `fetch` via `vi.fn()` for provider tests
- Target: line coverage ≥80% (enforced in vitest.config.ts)

### Test Files

| Test file | Tests | What |
|-----------|-------|------|
| `search-request.test.ts` | ~12 | `validate()` EP/BVA for DOI/ISBN/URL, `getType()`, edge cases |
| `citation-style.test.ts` | ~10 | `formatCitation()` for APA/MLA/Chicago × author counts × journal/book |
| `citation.test.ts` | ~4 | constructor, `format()`, `copyToClipboard()`, `getStyle()` |
| `citation-generator.test.ts` | ~6 | `generate()` with mocked providers, `resolveProvider()`, errors |
| `crossref-provider.test.ts` | ~4 | `fetchMetadata()` with mocked fetch, API errors, invalid DOI |
| `open-library-provider.test.ts` | ~4 | `fetchMetadata()` with mocked fetch, not found, invalid ISBN |
| `web-scraper-provider.test.ts` | ~4 | `fetchMetadata()` with mocked fetch, title extraction, invalid URL |
| `user.test.ts` | ~8 | Guest/RegisteredUser/Admin roles, login, saveCitation, deleteUser |

**Total: ~52 tests** (requirement: ≥10)

### EP/BVA Analysis (key methods)

#### SearchRequest.validate()

**Equivalence classes for identifier:**
| # | Class | Example | Expected |
|---|-------|---------|----------|
| 1 | Valid DOI | `10.1000/xyz` | true |
| 2 | Invalid DOI (no suffix) | `10.1000/` | false |
| 3 | Valid ISBN-13 | `978-3-16-148410-0` | true |
| 4 | Valid ISBN-10 | `0306406152` | true |
| 5 | Invalid ISBN (bad checksum) | `978-3-16-148410-1` | false |
| 6 | Invalid ISBN (wrong length) | `12345` | unrecognized type |
| 7 | Valid URL | `https://example.com` | true |
| 8 | Invalid URL (no protocol) | `example.com` | unrecognized type |
| 9 | Empty string | `""` | false |
| 10 | Unrecognizable identifier | `foobar` | throws on getType() |

**Boundary values:**
| # | Value | Why |
|---|-------|-----|
| 1 | `10.1000/x` | minimal valid DOI |
| 2 | `10.1/x` | DOI registrant too short (<4 digits) |
| 3 | 10-digit ISBN | ISBN-10 boundary |
| 4 | 13-digit ISBN | ISBN-13 boundary |
| 5 | 9-digit string | below ISBN-10 |
| 6 | 14-digit string | above ISBN-13 |

#### CitationStyle.formatCitation()

**Equivalence classes for authors array:**
| # | Class | Authors | APA output pattern |
|---|-------|---------|-------------------|
| 1 | No authors | `[]` | no author prefix |
| 2 | Single author | `["Smith"]` | `Smith.` |
| 3 | Two authors | `["Smith", "Jones"]` | `Smith, & Jones.` |
| 4 | Three+ authors | `["A", "B", "C"]` | `A, et al.` |

**Equivalence classes for publication type:**
| # | Class | Has journal? | Output |
|---|-------|-------------|--------|
| 1 | Journal article | yes | italic journal name, volume, issue |
| 2 | Book | no, has publisher | italic title, publisher |
| 3 | Minimal | no journal, no publisher | italic title only |

#### CitationGenerator.resolveProvider()

**Equivalence classes:**
| # | Class | Expected |
|---|-------|----------|
| 1 | Registered type (DOI) | returns CrossrefProvider |
| 2 | Registered type (ISBN) | returns OpenLibraryProvider |
| 3 | Unregistered type | throws error |

**Boundary:** empty providers map → constructor throws

### Code Comments

- JSDoc comments on all classes and public methods in source files
- Each test gets a comment with technique: `// EP: valid DOI class` or `// BVA: minimal DOI length`

### CI (bonus)

`.github/workflows/tests.yml`:
- Triggers: push, pull_request
- Steps: checkout → setup Node → install → `vitest run --coverage`
- Fail if coverage < 80%

### Report

`reports/lr3/report.md` containing:
1. Тема та мета
2. Вихідний код модуля з коментарями
3. Таблиця проєктування тестів (EP/BVA tables from above, expanded for all tested methods)
4. Вихідний код тестів з коментарями
5. Скріншот/HTML покриття коду
6. Посилання на GitHub
7. Висновки

### Grading alignment

| Step | Points | Covered by |
|------|--------|-----------|
| 1. Module implementation | 3 | Already done — 12 classes in src/ |
| 2. Test design (EP/BVA) | 3 | EP/BVA tables in report + test comments |
| 3. Unit tests (AAA + comments) | 3 | 8 test files, AAA pattern, technique comments |
| 4. ≥10 test cases | 2 | ~52 tests |
| 5. Coverage ≥80% | 2 | vitest coverage-v8, threshold enforced |
| 6. Iterative improvement | 2 | Coverage threshold in config ensures this |
| 7. Report + GitHub | 1 | reports/lr3/report.md + GitHub repo |
| Bonus: GitHub Actions | +1 | .github/workflows/tests.yml |
| **Total** | **16+1** | |
