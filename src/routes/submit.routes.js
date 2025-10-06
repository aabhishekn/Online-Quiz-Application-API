const express = require('express');
const submissionController = require('../controllers/submission.controller');
const validate = require('../middleware/validate');
const { submitSchema } = require('../models/question.model');
const router = express.Router({ mergeParams: true });

router.post('/', validate(submitSchema), submissionController.submitQuiz);

module.exports = router;
