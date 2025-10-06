const mongoose = require('mongoose');
const Joi = require('joi');

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3, maxlength: 100 },
  },
  { timestamps: true }
);

const Quiz = mongoose.model('Quiz', quizSchema);

const createQuizSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
});

module.exports = Quiz;
module.exports.createQuizSchema = createQuizSchema;
