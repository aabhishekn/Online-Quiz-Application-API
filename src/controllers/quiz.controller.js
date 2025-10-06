const quizService = require('../services/quiz.service');
const asyncHandler = require('../utils/asyncHandler');

exports.createQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.createQuiz(req.body);
  res.status(201).json(quiz);
});

exports.listQuizzes = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await quizService.listQuizzes({ page, limit });
  res.json(result);
});
