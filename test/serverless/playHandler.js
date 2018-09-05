const Code = require('code');
const Lab = require('lab');
const Pickme = require('@lucadv/pickme');
const Sinon = require('sinon');
const LambdaTester = require('lambda-tester');
const PlayHandler = require('../../serverless/functions').play.handler;

// Test shortcuts

const lab = exports.lab = Lab.script();
const before = lab.before;
const after = lab.after;
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('Serverless tests', () => {

  describe('play function', () => {

    const event = {
      queryStringParameters: {
        withPlayerMove: 'rock'
      }
    };

    describe('(general)', () => {

      it('should respond with 200 OK status code', () => LambdaTester(PlayHandler)
        .event(event)
        .expectResult((res) => {
          expect(res.statusCode).to.equal(200);
        }));

      it('should respond with 200 OK status code', () => LambdaTester(PlayHandler)
        .event(event)
        .expectResult((res) => {
          expect(res.headers['Access-Control-Allow-Origin']).to.equal('*');
          expect(res.headers['Access-Control-Allow-Credentials']).to.be.true();
        }));

      it('should respond a body in a serialised format', () => LambdaTester(PlayHandler)
        .event(event)
        .expectResult((res) => {
          const testFunc = () => JSON.parse(res.body);
          expect(testFunc).to.not.throw();
        }));

      it('should respond with a document with the moves played', () => LambdaTester(PlayHandler)
        .event(event)
        .expectResult((res) => {
          const result = JSON.parse(res.body);
          expect(result.moves).to.exist();
          expect(result.moves.player1).to.equal('rock');
          expect(['rock', 'paper', 'scissors']).to.include(result.moves.player2);
        }));
    });

    describe('(rock beats scissors)', () => {

      before(() => Sinon.stub(Pickme.prototype, 'pickOne').returns('scissors'));

      after(() => Pickme.prototype.pickOne.restore());

      it('should respond with player 1 as winner', () => LambdaTester(PlayHandler)
        .event(event)
        .expectResult((res) => {
          const result = JSON.parse(res.body);
          expect(result.winner).to.exist();
          expect(result.tie).to.not.exist();
          expect(result.winner).to.equal('player 1');
          expect(result.message).to.equal('rock beats scissors');
          expect(result.moves.player1).to.equal('rock');
          expect(result.moves.player2).to.equal('scissors');
        }));
    });

    describe('(scissors beats paper)', () => {

      before(() => Sinon.stub(Pickme.prototype, 'pickOne').returns('paper'));

      after(() => Pickme.prototype.pickOne.restore());

      it('should respond with player 2 as winner', () => LambdaTester(PlayHandler)
        .event({ queryStringParameters: { withPlayerMove: 'scissors' } })
        .expectResult((res) => {
          const result = JSON.parse(res.body);
          expect(result.winner).to.exist();
          expect(result.tie).to.not.exist();
          expect(result.winner).to.equal('player 1');
          expect(result.message).to.equal('scissors beats paper');
          expect(result.moves.player1).to.equal('scissors');
          expect(result.moves.player2).to.equal('paper');
        }));
    });

    describe('(paper beats rock)', () => {

      before(() => Sinon.stub(Pickme.prototype, 'pickOne').returns('rock'));

      after(() => Pickme.prototype.pickOne.restore());

      it('should respond with player 1 as winner', () => LambdaTester(PlayHandler)
        .event({ queryStringParameters: { withPlayerMove: 'paper' } })
        .expectResult((res) => {
          const result = JSON.parse(res.body);
          expect(result.winner).to.exist();
          expect(result.tie).to.not.exist();
          expect(result.winner).to.equal('player 1');
          expect(result.message).to.equal('paper beats rock');
          expect(result.moves.player1).to.equal('paper');
          expect(result.moves.player2).to.equal('rock');
        }));
    });

    describe('(tie)', () => {

      before(() => Sinon.stub(Pickme.prototype, 'pickOne').returns('paper'));

      after(() => Pickme.prototype.pickOne.restore());

      it('should respond with tie', () => LambdaTester(PlayHandler)
        .event({ queryStringParameters: { withPlayerMove: 'paper' } })
        .expectResult((res) => {
          const result = JSON.parse(res.body);
          expect(result.winner).to.not.exist();
          expect(result.tie).to.exist();
          expect(result.tie).to.be.true();
          expect(result.message).to.equal('Tie!');
          expect(result.moves.player1).to.equal('paper');
          expect(result.moves.player2).to.equal('paper');
        }));
    });

    describe('(missing required query string withPlayerMove)', () => {

      it('should callback with a 400 Bad Request', () => LambdaTester(PlayHandler)
        .event({ queryStringParameters: {} })
        .expectResult((res) => {
          expect(res.statusCode).to.equal(400);
          const result = JSON.parse(res.body);
          expect(result.error).to.equal('Bad Request');
          expect(result.message).to.equal('child "withPlayerMove" fails because ["withPlayerMove" is required]');
          expect(result.validation).to.deep.equal({ source: 'query', keys: ['withPlayerMove'] });
        }));
    });

    describe('(invalid value for query string withPlayerMove)', () => {

      it('should callback with a 400 Bad Request', () => LambdaTester(PlayHandler)
        .event({ queryStringParameters: { withPlayerMove: 'foo' } })
        .expectResult((res) => {
          expect(res.statusCode).to.equal(400);
          const result = JSON.parse(res.body);
          expect(result.error).to.equal('Bad Request');
          expect(result.message).to.equal('child "withPlayerMove" fails because '
          + '["withPlayerMove" must be one of [rock, paper, scissors]]');
          expect(result.validation).to.deep.equal({ source: 'query', keys: ['withPlayerMove'] });
        }));
    });
  });
});
