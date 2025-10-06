const scoringService = require('../../src/services/scoring.service');

describe('scoringService', () => {
  const quizId = 'quizid';
  const singleChoiceQ = {
    _id: 'q1',
    type: 'single_choice',
    options: [
      { _id: 'o1', isCorrect: true },
      { _id: 'o2', isCorrect: false },
    ],
  };
  const multiChoiceQ = {
    _id: 'q2',
    type: 'multiple_choice',
    options: [
      { _id: 'o3', isCorrect: true },
      { _id: 'o4', isCorrect: true },
      { _id: 'o5', isCorrect: false },
    ],
  };
  const textQ = {
    _id: 'q3',
    type: 'text',
    options: [],
  };

  beforeAll(() => {
    jest
      .spyOn(require('../../src/models/question.model'), 'find')
      .mockImplementation((query) => {
        if (query.quiz === quizId) {
          return Promise.resolve([singleChoiceQ, multiChoiceQ, textQ]);
        }
        return Promise.resolve([]);
      });
  });

  // Ensure database connections are closed properly
  afterAll(async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    jest.restoreAllMocks();
  });

  it('scores single_choice correctly', async () => {
    const answers = [
      { questionId: 'q1', selectedOptionIds: ['o1'] },
      { questionId: 'q2', selectedOptionIds: ['o3', 'o4'] },
    ];
    const result = await scoringService.submitQuiz(quizId, answers);
    expect(result.score).toBe(2); // Both answers are correct
    expect(result.total).toBe(2); // Total choice-type questions
  });

  it('requires exactly one selection for single_choice', async () => {
    await expect(
      scoringService.submitQuiz(quizId, [
        { questionId: 'q1', selectedOptionIds: [] },
      ]),
    ).rejects.toThrow('Exactly one option must be selected for single_choice');
  });

  it('scores multiple_choice only on exact set match', async () => {
    const answers = [{ questionId: 'q2', selectedOptionIds: ['o3', 'o4'] }];
    const result = await scoringService.submitQuiz(quizId, answers);
    expect(result.details[0].correct).toBe(true);
    const wrong = await scoringService.submitQuiz(quizId, [
      { questionId: 'q2', selectedOptionIds: ['o3'] },
    ]);
    expect(wrong.details[0].correct).toBe(false);
  });

  it('ignores text questions', async () => {
    const answers = [{ questionId: 'q3', selectedOptionIds: [] }];
    const result = await scoringService.submitQuiz(quizId, answers);
    expect(result.details[0].ignored).toBe(true);
  });

  it('rejects option ids not belonging to the question', async () => {
    await expect(
      scoringService.submitQuiz(quizId, [
        { questionId: 'q1', selectedOptionIds: ['badid'] },
      ]),
    ).rejects.toThrow();
  });
});
