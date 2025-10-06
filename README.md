# Quiz API JS

A production-ready backend API for a Quiz application built with **Node.js**, **Express**, and **MongoDB**. This API supports creating quizzes, adding questions, submitting answers, and calculating scores with robust validation and clean architecture.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Validation Rules](#validation-rules)
- [Example Usage](#example-usage)
- [Swagger Documentation](#swagger-documentation)
- [Testing](#testing)
- [Design Choices and Limitations](#design-choices-and-limitations)
- [Contributing](#contributing)
- [License](#license)

---

## Tech Stack

- **Node.js** + **Express**: Backend framework.
- **MongoDB** + **Mongoose**: Database and ORM.
- **Joi**: Schema validation.
- **Jest** + **Supertest**: Testing framework.
- **Swagger**: API documentation.
- **ESLint**, **Prettier**, **EditorConfig**: Code quality tools.

---

## Features

- Create and manage quizzes.
- Add questions to quizzes with validation.
- Submit answers and calculate scores.
- Pagination for listing quizzes.
- Swagger UI for interactive API documentation.
- Comprehensive unit and end-to-end tests.

---

## Quick Start

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/aabhishekn/Online-Quiz-Application-API.git
   cd Online-Quiz-Application-API
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Copy the example `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Set the `MONGODB_URI` and `PORT` in the `.env` file.

4. **Run the Application**:
   - Development mode:
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

5. **Access Swagger UI**:
   - Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) in your browser.

6. **Run Tests**:
   ```bash
   npm test
   ```

---

## API Endpoints

| Method | Endpoint                            | Description                   |
| ------ | ----------------------------------- | ----------------------------- |
| POST   | `/api/v1/quizzes`                   | Create a new quiz.            |
| GET    | `/api/v1/quizzes`                   | List all quizzes (paginated). |
| POST   | `/api/v1/quizzes/:quizId/questions` | Add a question to a quiz.     |
| GET    | `/api/v1/quizzes/:quizId/questions` | List questions (no answers).  |
| POST   | `/api/v1/quizzes/:quizId/submit`    | Submit answers and get score. |
| GET    | `/health`                           | Health check.                 |

---

## Validation Rules

- **Create Quiz**:
  - `title`: Required, 3–100 characters.
- **Add Question**:
  - `text`: Required, 3–500 characters.
  - `type`: Enum (`single_choice`, `multiple_choice`, `text`).
  - `options`: Required for choice types (min 2).
    - `single_choice`: Exactly one `isCorrect:true`.
    - `multiple_choice`: At least one `isCorrect:true`.
  - `expectedAnswer`: Optional for `text` type, ≤300 characters.
- **Submit**:
  - `answers`: Array of `{ questionId, selectedOptionIds }`.
  - `single_choice`: Exactly one selected ID.

---

## Example Usage

### Create a Quiz

```bash
curl -X POST http://localhost:3000/api/v1/quizzes \
-H "Content-Type: application/json" \
-d '{"title": "Math Quiz"}'
```

### Add a Question

```bash
curl -X POST http://localhost:3000/api/v1/quizzes/<quizId>/questions \
-H "Content-Type: application/json" \
-d '{
  "text": "What is 2+2?",
  "type": "single_choice",
  "options": [
    { "text": "3", "isCorrect": false },
    { "text": "4", "isCorrect": true }
  ]
}'
```

---

## Swagger Documentation

- Access the interactive API documentation at:
  [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Testing

- Run all tests:
  ```bash
  npm test
  ```
- Check test coverage:
  ```bash
  npx jest --coverage
  ```

---

## Design Choices and Limitations

- **Thin Controllers**: Business logic is delegated to services.
- **Validation**: Joi ensures robust input validation.
- **Scoring**: Exact set matching for `multiple_choice` questions.
- **Limitations**:
  - No user authentication.
  - No Docker support.

---

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License.
