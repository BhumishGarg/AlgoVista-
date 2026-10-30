# Database schema

The Flyway migration `V1__create_schema_and_topics.sql` creates:

- `users`: normalized unique email, BCrypt hash, default `USER` role, and timestamps.
- `topics`: stable unique slug and display order; the ten requested topic records are seeded.
- `questions`: topic foreign key, unique slug, optional/nullable metadata, timestamps, and visualization disabled by default.
- `bookmarks`: user and question foreign keys with a unique `(user_id, question_id)` constraint.
- `comments`: question and author foreign keys, a 2,000-character content limit, and a question/time index.

User-owned records are removed only when that user is explicitly deleted, through foreign-key cascade. No migration drops tables or resets data. `spring.jpa.hibernate.ddl-auto=validate` prevents Hibernate from changing the schema.

The supplied image has been transcribed into the version-controlled question CSV with 20 entries per topic. Difficulty, problem statements, examples, official URLs, and solutions were not supplied and remain blank. The startup importer upserts these records by stable topic-prefixed slug.
