const express = require('express');
const quizController = require('../controllers/quiz.controller');
const validate = require('../middleware/validate');
const { createQuizSchema } = require('../models/quiz.model');
const router = express.Router();

router.post('/', validate(createQuizSchema), quizController.createQuiz);
router.get('/', quizController.listQuizzes);

module.exports = router;
