# Phase 1 acceptance checklist

## Implemented in source

- [x] Responsive landing page, topic navigation, product preview, planned-feature labels, and reduced-motion styling.
- [x] Signup/login UI, Spring Security session authentication, BCrypt hashing, CSRF, logout, and backend authorization.
- [x] MySQL relational schema, Flyway migration, ten seeded topic categories, environment-based settings.
- [x] Database-backed topic/question endpoints, search, difficulty filter, and pagination.
- [x] Repeatable CSV question import path with row validation and import summary.
- [x] Problem details with unavailable-metadata messaging and no fabricated visualization/playground.
- [x] Persisted bookmark, comment, and profile endpoints with server-side ownership.
- [x] Empty/error/loading UI patterns for catalogue and authenticated data.
- [x] Backend unit/integration tests for session auth, CSRF, duplicate signup, profile updates, topic counts/search, bookmarks, and comment ownership.
- [x] Frontend production build and dependency audit.

## Verified

- [x] Transcribe and import all 200 titles and supplied LeetCode numbers from the attached image; verify 20 database records per topic in automated tests.
- [x] Run Maven tests with the generated Maven wrapper: all current H2-backed unit and integration tests pass.
- [x] Validate frontend production build after installing npm dependencies. `npm audit` reports zero known vulnerabilities.
- [x] Verify the Vite development server responds and the public landing page remains usable with a visible retry/error state when the backend is unavailable.

## Remaining environment check

- [ ] Run MySQL-backed integration journeys: local MySQL services were detected but stopped; no MySQL client or Docker command was available. They were not started to avoid changing an existing local database. After configuring MySQL, run the backend and verify the documented signup, login, catalogue, bookmarks, comments, profile, and logout journeys against MySQL.
