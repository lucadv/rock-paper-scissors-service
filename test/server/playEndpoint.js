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

  describe('/play endpoint', () => {

    describe('(with required query string parameters)', () => {

      const options = { method: 'GET', url: '/play?withPlayerMove=rock' };

      it('should respond with 200 OK status code', async () => {
        const res = await server.inject(options);
        expect(res.statusCode).to.equal(200);
      });

      it('should respond in a json format', async () => {
        const res = await server.inject(options);
        expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
      });

      it('should respond with a document with picked property', async () => {
        const res = await server.inject(options);
        expect(res.result.picked).to.exist();
      });

      it('should respond with a document with only one property', async () => {
        const res = await server.inject(options);
        expect(Object.keys(res.result)).to.have.length(1);
      });

      it('should have a picked property which is one of rock, paper or scissors', async () => {
        const res = await server.inject(options);
        expect(['rock', 'paper', 'scissors']).to.include(res.result.picked);
      });
    });

    describe('(missing required query string withPlayerMove)', () => {

      it('should respond with 400 Bad Request', async () => {
        const res = await server.inject({ method: 'GET', url: '/play' });
        expect(res.statusCode).to.equal(400);
        expect(res.result.error).to.equal('Bad Request');
        expect(res.result.message).to.equal('child "withPlayerMove" fails because ["withPlayerMove" is required]');
        expect(res.result.validation).to.deep.equal({ source: 'query', keys: ['withPlayerMove'] });
      });
    });

    describe('(invalid value for query string withPlayerMove)', () => {

      it('should respond with 400 Bad Request', async () => {
        const res = await server.inject({ method: 'GET', url: '/play?withPlayerMove=foo' });
        expect(res.statusCode).to.equal(400);
        expect(res.result.error).to.equal('Bad Request');
        expect(res.result.message).to.equal('child "withPlayerMove" fails because '
          + '["withPlayerMove" must be one of [rock, paper, scissors]]');
        expect(res.result.validation).to.deep.equal({ source: 'query', keys: ['withPlayerMove'] });
      });
    });

  });
});
