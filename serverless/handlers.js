const PickShape = require('../lib/pickShape');

module.exports = {
  pickShape: (event, context, callback) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify(PickShape())
    };
    callback(null, response);
  }
};
