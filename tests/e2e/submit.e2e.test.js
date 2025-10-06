const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const Quiz = require('../../src/models/quiz.model');
const Question = require('../../src/models/question.model');

describe('Submit API E2E', () => {
  let quizId, questionId, optionId;
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/quiztest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    const quiz = await Quiz.create({ title: 'Submit Quiz' });
    quizId = quiz._id;
    const q = await Question.create({
      quiz: quizId,
      text: '2+2?',
      type: 'single_choice',
      options: [
        { text: '4', isCorrect: true },
        { text: '3', isCorrect: false },
      ],
    });
    questionId = q._id;
    optionId = q.options[0]._id;
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('submits answers (correct score/total)', async () => {
    const res = await request(app)
      .post(`/api/v1/quizzes/${quizId}/submit`)
      .send({ answers: [{ questionId, selectedOptionIds: [optionId] }] });
    expect(res.status).toBe(200);
    expect(res.body.score).toBe(1);
    expect(res.body.total).toBe(1);
  });

  it('400 when questionId not in quiz', async () => {
    const res = await request(app)
      .post(`/api/v1/quizzes/${quizId}/submit`)
      .send({
        answers: [
          {
            questionId: new mongoose.Types.ObjectId(),
            selectedOptionIds: [optionId],
          },
        ],
      });
    expect(res.status).toBe(400);
  });

  it('400 when single_choice selection count invalid', async () => {
    const res = await request(app)
      .post(`/api/v1/quizzes/${quizId}/submit`)
      .send({ answers: [{ questionId, selectedOptionIds: [] }] });
    expect(res.status).toBe(400);
  });
});
