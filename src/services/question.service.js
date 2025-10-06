const Quiz = require('../models/quiz.model');
const Question = require('../models/question.model');
const { BAD_REQUEST } = require('../utils/errors');

function validateOptions(type, options) {
  if (!Array.isArray(options) || options.length < 2) throw BAD_REQUEST('At least 2 options required');
  const correctCount = options.filter((o) => o.isCorrect).length;
  if (type === 'single_choice' && correctCount !== 1) throw BAD_REQUEST('Exactly one correct option required');
  if (type === 'multiple_choice' && correctCount < 1) throw BAD_REQUEST('At least one correct option required');
}

exports.addQuestion = async (quizId, data) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw BAD_REQUEST('Quiz not found');
  if (['single_choice', 'multiple_choice'].includes(data.type)) {
    validateOptions(data.type, data.options);
  }
  const question = await Question.create({ ...data, quiz: quizId });
  return question;
};

exports.listQuestions = async (quizId) => {
  const questions = await Question.find({ quiz: quizId });
  return questions.map((q) => {
    const obj = q.toObject();
    delete obj.options?.forEach?.((o) => delete o.isCorrect);
    delete obj.expectedAnswer;
    if (Array.isArray(obj.options)) {
      obj.options = obj.options.map(({ _id, text }) => ({ _id, text }));
    }
    return obj;
  });
};
