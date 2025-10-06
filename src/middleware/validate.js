const Joi = require('joi');
const { BAD_REQUEST } = require('../utils/errors');

module.exports = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return res.status(400).json({
      error: {
        message: error.details.map((d) => d.message).join(', '),
        code: 'VALIDATION_ERROR',
      },
    });
  }
  req[property] = value;
  next();
};
