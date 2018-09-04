const PlayGame = require('../lib/playGame');
const Validation = require('../lib/validation');
const ErrorWrapper = require('../lib/errorWrapper');

module.exports = [{
  method: 'GET',
  path: '/',
  options: {
    description: 'Root endpoint that automatically redirects to /docs endpoint.'
  },
  handler: (request, h) => h.redirect('/docs')
}, {
  method: 'GET',
  path: '/play',
  options: {
    description: 'This endpoint allow to play the game Rock, Paper, Scissors. Use the query string'
      + 'parameter withPlayerMove to pass a shape and play your move. Game results will be passed'
      + 'back to response in JSON format.',
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
