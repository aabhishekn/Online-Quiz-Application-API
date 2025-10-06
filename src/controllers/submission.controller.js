const scoringService = require('../services/scoring.service');
const asyncHandler = require('../utils/asyncHandler');

exports.submitQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const result = await scoringService.submitQuiz(quizId, req.body.answers);
  res.json(result);
});
