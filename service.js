const Hapi = require('hapi');
const Routes = require('./server/routes');

const createServer = () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
  });

  server.route(Routes);
  return server;
};

const init = async () => {
  const server = createServer();
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

module.exports = {
  createServer,
  init
};
