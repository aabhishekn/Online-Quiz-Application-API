# quiz-api-js

A production-ready Quiz API backend built with Node.js, Express, and MongoDB (Mongoose). Features robust validation, clean architecture, full test coverage, and OpenAPI docs.

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- Joi (validation)
- Jest + Supertest (tests)
- ESLint (airbnb-base) + Prettier + EditorConfig
- Swagger (OpenAPI YAML)
- Nodemon for development

## Quick Start
```sh
npm i
cp .env.example .env   # set MONGODB_URI, PORT=3000
npm run dev
# Swagger: http://localhost:3000/api-docs
npm test
```

## Endpoints
| Method | Endpoint                                 | Description                  |
|--------|------------------------------------------|------------------------------|
| POST   | /api/v1/quizzes                          | Create quiz                  |
| GET    | /api/v1/quizzes                          | List quizzes (pagination)    |
| POST   | /api/v1/quizzes/:quizId/questions        | Add question to quiz         |
| GET    | /api/v1/quizzes/:quizId/questions        | List questions (no answers)  |
| POST   | /api/v1/quizzes/:quizId/submit           | Submit answers & get score   |
| GET    | /health                                 | Health check                 |

## Validation Rules
- **Quiz**: title required (3–100 chars)
- **Question**:
  - text required (3–500)
  - type: single_choice | multiple_choice | text
  - For choice types: options required (min 2), each { text, isCorrect }
    - single_choice: exactly one correct
    - multiple_choice: at least one correct
  - For text: expectedAnswer optional, ≤300 chars
- **Submit**:
  - answers: array of { questionId, selectedOptionIds[] }
  - single_choice: exactly one selected

## Example cURL
Create quiz:
```sh
curl -X POST http://localhost:3000/api/v1/quizzes -H "Content-Type: application/json" -d '{"title":"Math Quiz"}'
```
Add question:
```sh
curl -X POST http://localhost:3000/api/v1/quizzes/<quizId>/questions -H "Content-Type: application/json" -d '{"text":"2+2?","type":"single_choice","options":[{"text":"4","isCorrect":true},{"text":"3","isCorrect":false}]}'
```
Submit answers:
```sh
curl -X POST http://localhost:3000/api/v1/quizzes/<quizId>/submit -H "Content-Type: application/json" -d '{"answers":[{"questionId":"<questionId>","selectedOptionIds":["<optionId>"]}]}'
```

## Design Choices & Limitations
- Controllers are thin; business logic in services; DB logic in models.
- Consistent error JSON: `{ "error": { "message": "...", "code": "..." } }`
- GET questions never leaks correct answers.
- Scoring: exact-set match for multiple_choice, text questions ignored.
- Pagination: ?page&limit, limit max 100.
- No Docker, JavaScript only.

---

✅ Quiz API scaffolded successfully!
Endpoints:
POST /api/v1/quizzes
GET  /api/v1/quizzes
POST /api/v1/quizzes/:quizId/questions
GET  /api/v1/quizzes/:quizId/questions
POST /api/v1/quizzes/:quizId/submit
GET  /health
Run locally:
npm i
cp .env.example .env
npm run dev
# Swagger: http://localhost:3000/api-docs
npm test
Notes:
- GET questions never leaks correct answers
- Scoring does exact-set match for multiple_choice
- Text questions are ignored for scoring
