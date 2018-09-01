const PickShape = require('../lib/pickShape');

module.exports = [{
  method: 'GET',
  path: '/pick-shape',
  handler: (/* request, h */) => PickShape()
}];
