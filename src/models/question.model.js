const mongoose = require('mongoose');
const Joi = require('joi');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const questionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', index: true, required: true },
    text: { type: String, required: true, minlength: 3, maxlength: 500 },
    type: { type: String, enum: ['single_choice', 'multiple_choice', 'text'], required: true },
    options: [optionSchema],
    expectedAnswer: { type: String, maxlength: 300 },
  },
  { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);

const addQuestionSchema = Joi.object({
  text: Joi.string().min(3).max(500).required(),
  type: Joi.string().valid('single_choice', 'multiple_choice', 'text').required(),
  options: Joi.when('type', {
    is: Joi.valid('single_choice', 'multiple_choice'),
    then: Joi.array()
      .items(
        Joi.object({
          text: Joi.string().required(),
          isCorrect: Joi.boolean().required(),
        })
      )
      .min(2)
      .required(),
    otherwise: Joi.forbidden(),
  }),
  expectedAnswer: Joi.when('type', {
    is: 'text',
    then: Joi.string().max(300).optional(),
    otherwise: Joi.forbidden(),
  }),
});

const submitSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().required(),
        selectedOptionIds: Joi.array().items(Joi.string()),
      })
    )
    .required(),
});

module.exports = Question;
module.exports.addQuestionSchema = addQuestionSchema;
module.exports.submitSchema = submitSchema;
