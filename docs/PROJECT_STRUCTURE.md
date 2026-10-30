# Project structure

```text
frontend/
  src/App.jsx                    React routes and page components
  src/context/AuthContext.jsx    Session-backed current-user state
  src/services/api.js            Credentialed HTTP client and CSRF header
  src/styles.css                 Shared responsive design system
backend/
  src/main/java/com/algovista/
    controller/                  REST adapters
    dto/                         Validated request and safe response types
    entity/                      JPA relational entities
    exception/                   Consistent safe error responses
    repository/                  Spring Data repositories
    security/                    Session, CSRF, CORS and password configuration
    service/                     Account, catalogue and ownership logic
  src/main/resources/
    db/migration/                Flyway schema and topic seed
    data/question-bank.csv       Repeatable catalogue import source
docs/
```

The frontend never stores account, bookmark, or progress data as its source of truth. The backend owns all persisted state. The database is migrated by Flyway and Hibernate only validates the schema.
