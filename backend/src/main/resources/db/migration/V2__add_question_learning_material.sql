ALTER TABLE questions
    ADD COLUMN approaches_json JSON NULL,
    ADD COLUMN visualization_guide TEXT NULL;
