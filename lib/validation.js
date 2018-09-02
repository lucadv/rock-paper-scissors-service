const Joi = require('joi');

module.exports = {
  query: {
    withPlayerMove: Joi.string().valid(['rock', 'paper', 'scissors']).required()
  }
};
