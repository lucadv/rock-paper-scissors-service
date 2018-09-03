const Joi = require('joi');
const PickShape = require('../lib/pickShape');
const PlayGame = require('../lib/playGame');
const Validation = require('../lib/validation');
const ErrorWrapper = require('../lib/errorWrapper');

module.exports = {
  play: (event, context, callback) => {
    const result = Joi.validate(event.queryStringParameters, Validation.query);
    if (result.error) {
      const boom = ErrorWrapper(result.error).output.payload;
      return callback(null, {
        statusCode: boom.statusCode,
        body: JSON.stringify({
          error: boom.error,
          message: boom.message,
          validation: boom.validation
        })
      });
    }
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(PlayGame(event.queryStringParameters.withPlayerMove, PickShape().picked))
    });
  }
};
