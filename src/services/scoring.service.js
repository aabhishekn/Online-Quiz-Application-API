const Question = require('../models/question.model');
const { BAD_REQUEST } = require('../utils/errors');

function setEquals(a, b) {
  if (a.length !== b.length) return false;
  return a.every((v) => b.includes(v));
}

// Add validation to ensure selectedOptionIds exist in the question's options
exports.submitQuiz = async (quizId, answers) => {
  const questions = await Question.find({ quiz: quizId });
  const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));
  let score = 0;
  let total = 0;
  let ignoredTextQuestions = 0;
  const details = [];

  for (const ans of answers) {
    const q = questionMap.get(ans.questionId);
    if (!q) throw BAD_REQUEST('Invalid questionId for this quiz');
    if (['single_choice', 'multiple_choice'].includes(q.type)) {
      total++;
      const correctIds = q.options
        .filter((o) => o.isCorrect)
        .map((o) => o._id.toString());
      const selected = (ans.selectedOptionIds || []).map(String);

      // Validate selectedOptionIds
      const optionIds = q.options.map((o) => o._id.toString());
      if (!selected.every((id) => optionIds.includes(id))) {
        throw BAD_REQUEST('Invalid selectedOptionIds for the question');
      }

      if (q.type === 'single_choice') {
        if (selected.length !== 1)
          throw BAD_REQUEST(
            'Exactly one option must be selected for single_choice',
          );
        details.push({
          questionId: q._id,
          correct: selected[0] === correctIds[0],
          ignored: false,
        });
        if (selected[0] === correctIds[0]) score++;
      } else if (q.type === 'multiple_choice') {
        const isCorrect = setEquals(selected, correctIds);
        details.push({ questionId: q._id, correct: isCorrect, ignored: false });
        if (isCorrect) score++;
      }
    } else {
      ignoredTextQuestions++;
      details.push({ questionId: q._id, correct: false, ignored: true });
    }
  }

  return {
    score,
    total,
    details,
    meta: {
      totalChoiceQuestions: total,
      ignoredTextQuestions,
    },
  };
};
