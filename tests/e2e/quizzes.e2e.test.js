const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const Quiz = require('../../src/models/quiz.model');
const Question = require('../../src/models/question.model');

describe('Quiz API E2E', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/quiztest', { useNewUrlParser: true, useUnifiedTopology: true });
    await Quiz.deleteMany({});
    await Question.deleteMany({});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  let quizId;
  it('creates quiz (valid)', async () => {
    const res = await request(app).post('/api/v1/quizzes').send({ title: 'Test Quiz' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Quiz');
    quizId = res.body._id;
  });

  it('fails to create quiz (invalid)', async () => {
    const res = await request(app).post('/api/v1/quizzes').send({ title: 'A' });
    expect(res.status).toBe(400);
  });

  it('adds question (valid)', async () => {
    const res = await request(app)
      .post(`/api/v1/quizzes/${quizId}/questions`)
      .send({
        text: '2+2?',
        type: 'single_choice',
        options: [
          { text: '4', isCorrect: true },
          { text: '3', isCorrect: false },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.text).toBe('2+2?');
  });

  it('fails to add question (invalid payload)', async () => {
    const res = await request(app)
      .post(`/api/v1/quizzes/${quizId}/questions`)
      .send({ text: 'Bad', type: 'single_choice', options: [{ text: 'A', isCorrect: false }] });
    expect(res.status).toBe(400);
  });

  it('gets questions (no answer leakage)', async () => {
    const res = await request(app).get(`/api/v1/quizzes/${quizId}/questions`);
    expect(res.status).toBe(200);
    expect(res.body[0].options[0].isCorrect).toBeUndefined();
    expect(res.body[0].expectedAnswer).toBeUndefined();
  });
});
