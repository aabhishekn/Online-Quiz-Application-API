const express = require('express');
const questionController = require('../controllers/question.controller');
const validate = require('../middleware/validate');
const { addQuestionSchema } = require('../models/question.model');
const router = express.Router({ mergeParams: true });

router.post('/', validate(addQuestionSchema), questionController.addQuestion);
router.get('/', questionController.listQuestions);

module.exports = router;
