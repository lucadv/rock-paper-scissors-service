const Joi = require('joi');
const PlayGame = require('../lib/playGame');
const Validation = require('../lib/validation');
const ErrorWrapper = require('../lib/errorWrapper');

module.exports = {
  play: {
    handler: (event, context, callback) => {
      const result = Joi.validate(event.queryStringParameters, Validation.query);
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true // Required for cookies, authorization headers with HTTPS
      };
      if (result.error) {
        const boom = ErrorWrapper(result.error).output.payload;
        return callback(null, {
          statusCode: boom.statusCode,
          headers: corsHeaders,
          body: JSON.stringify({
            error: boom.error,
            message: boom.message,
            validation: boom.validation
          })
        });
      }
      callback(null, {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(PlayGame(event.queryStringParameters.withPlayerMove))
      });
    }
  }
};
