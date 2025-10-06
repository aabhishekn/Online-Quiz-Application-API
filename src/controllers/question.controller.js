const questionService = require('../services/question.service');
const asyncHandler = require('../utils/asyncHandler');

exports.addQuestion = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const question = await questionService.addQuestion(quizId, req.body);
  res.status(201).json(question);
});

exports.listQuestions = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const questions = await questionService.listQuestions(quizId);
  res.json(questions);
});
