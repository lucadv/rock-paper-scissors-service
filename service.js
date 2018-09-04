const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');
const Lout = require('lout');
const Routes = require('./server/routes');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || '0.0.0.0',
  });
  // adding routes
  server.route(Routes);
  // registering plugins for documentation endpoint
  await server.register([Vision, Inert, Lout]);
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

module.exports = {
  init
};
