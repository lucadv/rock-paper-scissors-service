const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');
const Pickme = require('@lucadv/pickme');
const Sinon = require('sinon');
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

    const options = { method: 'GET', url: '/play?withPlayerMove=rock' };

    describe('(with required query string parameters)', () => {

      describe('(general)', () => {

        it('should respond with 200 OK status code', async () => {
          const res = await server.inject(options);
          expect(res.statusCode).to.equal(200);
        });

        it('should respond in a json format', async () => {
          const res = await server.inject(options);
          expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
        });

        it('should respond with a document with the moves played', async () => {
          const res = await server.inject(options);
          expect(res.result.moves).to.exist();
          expect(res.result.moves.player1).to.equal('rock');
          expect(['rock', 'paper', 'scissors']).to.include(res.result.moves.player2);
        });

      });

      describe('(rock beats scissors)', () => {

        before(() => Sinon.stub(Pickme.prototype, 'pickOne').returns('scissors'));

        after(() => Pickme.prototype.pickOne.restore());

        it('should respond with player 1 as winner', async () => {
          const res = await server.inject(options);
          expect(res.result.winner).to.exist();
          expect(res.result.tie).to.not.exist();
          expect(res.result.winner).to.equal('player 1');
          expect(res.result.message).to.equal('rock beats scissors');
          expect(res.result.moves.player1).to.equal('rock');
          expect(res.result.moves.player2).to.equal('scissors');
        });
      });

      describe('(scissors beats paper)', () => {

        before(() => Sinon.stub(Pickme.prototype, 'pickOne').returns('paper'));

        after(() => Pickme.prototype.pickOne.restore());

        it('should respond with player 2 as winner', async () => {
          options.url = '/play?withPlayerMove=scissors';
          const res = await server.inject(options);
          expect(res.result.winner).to.exist();
          expect(res.result.tie).to.not.exist();
          expect(res.result.winner).to.equal('player 1');
          expect(res.result.message).to.equal('scissors beats paper');
          expect(res.result.moves.player1).to.equal('scissors');
          expect(res.result.moves.player2).to.equal('paper');
        });
      });

      describe('(paper beats rock)', () => {

        before(() => Sinon.stub(Pickme.prototype, 'pickOne').returns('rock'));

        after(() => Pickme.prototype.pickOne.restore());

        it('should respond with player 1 as winner', async () => {
          options.url = '/play?withPlayerMove=paper';
          const res = await server.inject(options);
          expect(res.result.winner).to.exist();
          expect(res.result.tie).to.not.exist();
          expect(res.result.winner).to.equal('player 1');
          expect(res.result.message).to.equal('paper beats rock');
          expect(res.result.moves.player1).to.equal('paper');
          expect(res.result.moves.player2).to.equal('rock');
        });
      });

      describe('(tie)', () => {

        before(() => Sinon.stub(Pickme.prototype, 'pickOne').returns('paper'));

        after(() => Pickme.prototype.pickOne.restore());

        it('should respond with tie', async () => {
          options.url = '/play?withPlayerMove=paper';
          const res = await server.inject(options);
          expect(res.result.winner).to.not.exist();
          expect(res.result.tie).to.exist();
          expect(res.result.tie).to.be.true();
          expect(res.result.message).to.equal('Tie!');
          expect(res.result.moves.player1).to.equal('paper');
          expect(res.result.moves.player2).to.equal('paper');
        });
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
