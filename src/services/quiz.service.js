const Quiz = require('../models/quiz.model');
const pagination = require('../utils/pagination');

exports.createQuiz = async ({ title }) => {
  const quiz = await Quiz.create({ title });
  return quiz;
};

exports.listQuizzes = async ({ page = 1, limit = 10 }) => {
  const { skip, limit: lim } = pagination(page, limit);
  const [quizzes, total] = await Promise.all([
    Quiz.find().sort({ createdAt: -1 }).skip(skip).limit(lim),
    Quiz.countDocuments(),
  ]);
  return {
    data: quizzes,
    page: Number(page),
    limit: lim,
    total,
  };
};
