const PlayGame = require('../lib/playGame');
const Validation = require('../lib/validation');
const ErrorWrapper = require('../lib/errorWrapper');

module.exports = [{
  method: 'GET',
  path: '/',
  handler: (request, h) => h.redirect('/docs')
}, {
  method: 'GET',
  path: '/play',
  options: {
    validate: {
      query: Validation.query,
      failAction: async (request, h, err) => {
        throw ErrorWrapper(err);
      }
    },
    cors: {
      origin: ['*'],
      additionalHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials']
    }
  },
  handler: request => PlayGame(request.query.withPlayerMove)
}];
