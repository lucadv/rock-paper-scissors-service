const Boom = require('boom');

module.exports = (err) => {
  const boom = Boom.badRequest(err.message);
  boom.output.payload.validation = { source: 'query', keys: [err.details[0].context.key] };
  return boom;
};
