CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE TABLE topics (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    description VARCHAR(500) NOT NULL,
    display_order INT NOT NULL,
    CONSTRAINT uq_topics_slug UNIQUE (slug)
);

CREATE TABLE questions (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL,
    topic_id BIGINT NOT NULL,
    leetcode_number INT NULL,
    official_url VARCHAR(500) NULL,
    difficulty VARCHAR(20) NULL,
    short_description VARCHAR(1000) NULL,
    statement TEXT NULL,
    examples_json JSON NULL,
    constraints_text TEXT NULL,
    input_description TEXT NULL,
    output_description TEXT NULL,
    reference_java_code MEDIUMTEXT NULL,
    visualization_supported BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_questions_slug UNIQUE (slug),
    CONSTRAINT fk_questions_topic FOREIGN KEY (topic_id) REFERENCES topics(id),
    INDEX ix_questions_topic (topic_id, title),
    INDEX ix_questions_difficulty (difficulty),
    INDEX ix_questions_number (leetcode_number)
);

CREATE TABLE bookmarks (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_bookmark_user_question UNIQUE (user_id, question_id),
    CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_bookmarks_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX ix_bookmarks_user (user_id, created_at)
);

CREATE TABLE comments (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    content VARCHAR(2000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX ix_comments_question_created (question_id, created_at)
);

INSERT INTO topics (name, slug, description, display_order) VALUES
('Arrays', 'arrays', 'Work with ordered data and build strong problem-solving fundamentals.', 1),
('Linked Lists', 'linked-lists', 'Understand nodes, pointers and flexible sequential structures.', 2),
('Stacks', 'stacks', 'Explore last-in, first-out structures and their applications.', 3),
('Queues', 'queues', 'Learn first-in, first-out processing and scheduling patterns.', 4),
('Binary Trees', 'binary-trees', 'Navigate hierarchical data and foundational tree algorithms.', 5),
('Heaps / Priority Queue', 'heaps-priority-queue', 'Organize data by priority with efficient heap operations.', 6),
('Searching', 'searching', 'Choose effective strategies to find data in a collection.', 7),
('Sorting', 'sorting', 'Compare approaches to ordering data and their trade-offs.', 8),
('Graphs', 'graphs', 'Model relationships, networks and connected systems.', 9),
('Dynamic Programming', 'dynamic-programming', 'Break complex problems into reusable subproblems.', 10);
