# AlgoVista

AlgoVista is a React and Spring Boot learning catalogue for data structures and algorithms. It includes account, topic, question, bookmark, comment, and profile foundations, plus browser-based step visualizations for all 20 Array and all 20 Linked List problems. User-submitted source code is not compiled or executed.

## Requirements

- Node.js 20+ and npm
- Java 21
- Maven 3.9+
- MySQL 8+

This workspace was empty when implementation began. The original specification arrived without the question list; the list was subsequently supplied as an image and transcribed into the version-controlled CSV. The app seeds ten topics and imports those 200 question titles/numbers on startup. No statements, examples, difficulty labels, official links, solutions, or personal user data have been fabricated.

## Configure MySQL

Start a local MySQL server, then create a database and a restricted application account using the MySQL client:

```sql
CREATE DATABASE algovista CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'algovista'@'localhost' IDENTIFIED BY 'choose-a-local-password';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES
  ON algovista.* TO 'algovista'@'localhost';
```

Flyway applies versioned migrations on backend startup. The application uses `ddl-auto: validate`; it never drops or recreates a database.

Copy `backend\.env.example` values into your PowerShell session (replace the local password):

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/algovista?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME = "algovista"
$env:DB_PASSWORD = "choose-a-local-password"
$env:FRONTEND_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"
$env:COOKIE_SECURE = "false"
```

Do not use these local-development cookie settings in production. Production must use HTTPS and `COOKIE_SECURE=true`.
For a frontend and API on different sites, set `SESSION_COOKIE_SAME_SITE=None` together with `COOKIE_SECURE=true`; keep `lax` for local development and same-site deployments.

## Run the application

### Quick local demo without MySQL

If MySQL is not running, use the `local` profile. It uses a file-backed H2 database in `backend\data\`, persists registrations and saved data across restarts, and imports the question bank. This profile is for local demonstration only; the default application profile still uses MySQL and Flyway.

In one PowerShell terminal:

```powershell
cd backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
```

In another PowerShell terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. The backend health endpoint is <http://localhost:8080/api/health>.

## Tests and production build

```powershell
cd backend
.\mvnw.cmd test
```

```powershell
cd frontend
npm run build
```

## Question bank

The source list from the supplied image has been transcribed into `backend\src\main\resources\data\question-bank.csv`. It contains 200 titles across ten topics; problem numbers are preserved as supplied. Rows use this header:

```text
topicSlug,title,slug,leetcodeNumber
```

The import runs on backend startup and is repeatable by question slug. Existing users, bookmarks, comments, and unrelated questions are not deleted. Invalid rows are skipped with a warning and included in the summary; blank rows are counted separately. The summary reports imported, updated, skipped, and invalid rows. Allowed topic slugs are `arrays`, `linked-lists`, `stacks`, `queues`, `binary-trees`, `heaps-priority-queue`, `searching`, `sorting`, `graphs`, and `dynamic-programming`. The importer validates slug format, duplicate slugs, topic association, difficulty values, LeetCode HTTPS URLs, and examples JSON. Duplicate LeetCode numbers across topics are allowed. Unknown statements and metadata should be left blank, not guessed.

The four-column question list remains the source for titles and problem numbers. Detailed learning content for the 20 Array questions is maintained separately in `backend\src\main\resources\data\arrays-learning-material.json` and imported by question slug. It includes statements, constraints, input/output formats, examples, approaches, complexity, and visualization guidance. Array problem pages link to a workspace with Java, Python, and C++ reference methods, sample/custom input, and step-by-step browser visualizations. The 20 Linked Lists questions have their supplied statements, constraints, input/output formats, and examples in `backend\src\main\resources\data\linked-lists-learning-material.json`; each links to a workspace with Java, Python, and C++ reference solutions and pointer-based walkthroughs for sample or custom input. The 20 Stack questions have statements, constraints, input/output formats, examples, and approaches in `backend\src\main\resources\data\stacks-learning-material.json`; each also links to a workspace with Java, Python, and C++ reference solutions and step-by-step stack-operation visualizations for sample or custom input. The 20 Queue questions have their statements, constraints, input/output formats, examples, and approaches in `backend\src\main\resources\data\queues-learning-material.json`; each has Java, Python, and C++ reference solutions and a browser-based visualization for sample or custom input, including circular queues/deques, tree and grid BFS, and monotonic queues. The 20 Binary Tree questions have statements, constraints, input/output formats, examples, approaches, and visualization guides in `backend\src\main\resources\data\binary-trees-learning-material.json`; each question links to an interactive browser-based tree walkthrough and displays Java, Python, and C++ reference solutions. The 20 Heap and Priority Queue questions have their problem material in `backend\src\main\resources\data\heaps-learning-material.json`; each has a heap walkthrough and Java, Python, and C++ reference solutions. Tree and heap custom inputs are bounded to keep browser playback responsive. These visualizers use built-in browser algorithms; displayed reference code is not compiled or executed. Custom linked-list visualizer inputs are limited to 100 nodes (1,000 for random-pointer lists), Stack array values and operation sequences to 100 items, and decoded strings to 10,000 output characters. Other topics remain without problem details or interactive visualizers until their material is supplied. Difficulty and official URLs remain blank unless verified.

## Authentication and security

- Spring Security session authentication uses an HttpOnly `JSESSIONID` cookie.
- CSRF protection is enabled with the `XSRF-TOKEN` cookie and `X-XSRF-TOKEN` request header.
- The frontend uses `credentials: "include"` and does not persist account data or tokens in localStorage.
- Signup validates on both client and server, normalizes email addresses, and hashes passwords with BCrypt.
- Password input is limited to 72 UTF-8 bytes to avoid BCrypt's input truncation behavior.
- Profile, bookmark, and comment mutations use the authenticated principal; user IDs supplied by clients are never used for ownership.
- A user can edit or delete only their own comments.
- CORS allows only the configured frontend origin.

For deployment, use HTTPS, set the allowed origin to the exact deployed origin, enable secure cookies, and supply credentials through the deployment environment or secret manager.

## Implemented pages

- Public landing page and topic catalogue
- Sign up, login, logout, and protected routes
- Topic search and paged question lists with optional difficulty filtering
- Problem details, verified metadata display, and honest empty/unavailable states
- Persisted bookmarks and comments with backend ownership checks
- Persisted profile editing
- Step-by-step Array problem visualizations with Java, Python, and C++ reference solutions
- Interactive Queue problem visualizations with Java, Python, and C++ reference solutions
- Interactive Searching workspaces for all 20 questions, with Java, Python, and C++ reference code, locally processed custom input, and bounded algorithm traces in `backend\src\main\resources\data\searching-learning-material.json`
- Interactive Sorting workspaces for all 20 questions, with supplied problem details, Java, Python, and C++ reference solutions, locally processed custom input, and bounded sorting/interval walkthroughs in `backend\src\main\resources\data\sorting-learning-material.json`
- Interactive Graph workspaces for all 20 questions, with supplied problem details, Java, Python, and C++ reference solutions, locally processed bounded graph/grid traces, and visualizations for traversal, shortest paths, topological sorting, and connectivity in `backend\src\main\resources\data\graphs-learning-material.json`
- Responsive layout, keyboard focus styles, and reduced-motion support

Question counts and saved data are returned from the database. With the currently absent question source file, topic counts are honestly zero; individual question detail, bookmark, and comment workflows require an imported question.
