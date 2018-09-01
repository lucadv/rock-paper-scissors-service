const PickShape = require('../lib/pickShape');

module.exports = {
  pickShape: (event, context, callback) => {
    callback(null, PickShape());
  }
};
