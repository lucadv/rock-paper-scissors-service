const Service = require('./service');

Service.init();

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
