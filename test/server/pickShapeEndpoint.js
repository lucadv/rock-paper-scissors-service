const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const Routes = require('../../server/routes');
// Test shortcuts

const lab = exports.lab = Lab.script();
const before = lab.before;
const after = lab.after;
// const beforeEach = lab.beforeEach;
// const afterEach = lab.afterEach;
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('Server tests', () => {

  const server = Hapi.server();
  server.route(Routes);

  before(async () => server.start());
  after(async () => server.stop());

  describe('/pick-shape endpoint', () => {

    it('should respond with 200 OK status code', async () => {
      const res = await server.inject({ method: 'GET', url: '/pick-shape' });
      expect(res.statusCode).to.equal(200);
    });

    it('should respond in a json format', async () => {
      const res = await server.inject({ method: 'GET', url: '/pick-shape' });
      expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
    });

    it('should respond with a document with picked property', async () => {
      const res = await server.inject({ method: 'GET', url: '/pick-shape' });
      expect(res.result.picked).to.exist();
    });

    it('should respond with a document with only one property', async () => {
      const res = await server.inject({ method: 'GET', url: '/pick-shape' });
      expect(Object.keys(res.result)).to.have.length(1);
    });

    it('should have a picked property which is one of rock, paper or scissors', async () => {
      const res = await server.inject({ method: 'GET', url: '/pick-shape' });
      expect(['rock', 'paper', 'scissors']).to.include(res.result.picked);
    });

  });
});
