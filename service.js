const Hapi = require('hapi');
const Routes = require('./routes');

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
});

server.route(Routes);

const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  // console.log(err);
  process.exit(1);
});

init();
