const express = require('express');
const quizRoutes = require('./quiz.routes');
const questionRoutes = require('./question.routes');
const submitRoutes = require('./submit.routes');

const router = express.Router();

router.use('/quizzes', quizRoutes);
router.use('/quizzes/:quizId/questions', questionRoutes);
router.use('/quizzes/:quizId/submit', submitRoutes);

module.exports = router;
