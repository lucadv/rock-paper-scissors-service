const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const Routes = require('../../server/routes');

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('Server tests', () => {

  const server = Hapi.server();
  server.route(Routes);

  describe('(root endpoint)', () => {

    it('should redirect to /docs', async () => {
      const res = await server.inject({ method: 'GET', url: '/' });
      expect(res.statusCode).to.equal(302);
      expect(res.headers.location).to.equal('/docs');
    });
  });

});
