const PickShape = require('../lib/pickShape');
const PlayGame = require('../lib/playGame');
const Validation = require('../lib/validation');
const ErrorWrapper = require('../lib/errorWrapper');

module.exports = [{
  method: 'GET',
  path: '/play',
  options: {
    validate: {
      query: Validation.query,
      failAction: async (request, h, err) => {
        throw ErrorWrapper(err);
      }
    }
  },
  handler: request => PlayGame(request.query.withPlayerMove, PickShape().picked)
}];
