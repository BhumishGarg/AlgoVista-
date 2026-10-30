# REST API

Base URL: `http://localhost:8080/api`. JSON errors use `{"message":"..."}`. Authenticated browser requests use the session cookie and CSRF token.

## Authentication

- `GET /auth/csrf` — issues/returns the CSRF token required for unsafe requests.
- `POST /auth/signup` — `{ "fullName": "Ada Lovelace", "email": "ada@example.com", "password": "..." }`; responds `201` with a safe user object and establishes a session.
- `POST /auth/login` — `{ "email": "...", "password": "..." }`; responds with the same generic invalid-credentials message for unknown email or wrong password.
- `POST /auth/logout` — invalidates the session and returns `204`.
- `GET /auth/me` — returns `{"user": null}` when anonymous, otherwise the public user fields.

Signup/login request flow: call `GET /api/auth/csrf`; send the `XSRF-TOKEN` cookie value in `X-XSRF-TOKEN`, and include browser credentials. The frontend HTTP client does this automatically.

## Topics and questions

- `GET /topics` and `GET /topics/{slug}` — topic metadata and count from `questions`.
- `GET /questions?search=&difficulty=&page=0&size=20`
- `GET /topics/{slug}/questions?search=&difficulty=&page=0&size=20`
- `GET /questions/{slug}` — full optional metadata; missing fields remain `null` or empty.

Question pages return a standard `content`, `totalElements`, `totalPages`, `number`, and `size` structure. Page size is limited to 100. `difficulty` accepts `EASY`, `MEDIUM`, or `HARD`.

## Bookmarks

- `GET /bookmarks` — authenticated user only.
- `POST /bookmarks/{questionId}` — creates a bookmark; repeated creation is idempotent and returns `201`.
- `DELETE /bookmarks/{questionId}` — removes only the current user's bookmark; returns `204`.

## Comments

- `GET /questions/{questionId}/comments?page=0&size=20` — paginated public read.
- `POST /questions/{questionId}/comments` — authenticated; body `{"content":"..."}`; returns `201`.
- `PUT /comments/{commentId}` — authenticated owner only; same body; returns `200`.
- `DELETE /comments/{commentId}` — authenticated owner only; returns `204`.

Comments must contain 1–2,000 non-whitespace characters. Missing records return `404`; ownership violations return `403`.

## Profile and health

- `GET /users/me` — authenticated user's safe profile and actual bookmark count.
- `PUT /users/me` — authenticated profile update; body `{"fullName":"Ada Lovelace"}`. Role and email cannot be changed here.
- `GET /health` — local application health response; Actuator also exposes `/actuator/health`.

Validation failures return `400`, unauthenticated requests return `401`, duplicate email conflicts return `409`, and unexpected server errors do not expose stack traces.
