const Code = require('code');
const Lab = require('lab');
const LambdaTester = require('lambda-tester');
const PickShapeHandler = require('../../serverless/handlers').play;

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('Serverless tests', () => {

  describe('play function', () => {

    describe('(with required query string parameters)', () => {

      const event = {
        queryString: {
          withPlayerMove: 'rock'
        }
      };

      it('should return a 200 OK statusCode', () => LambdaTester(PickShapeHandler)
        .event(event)
        .expectResult((res) => {
          expect(res.statusCode).to.equal(200);
        }));

      it('should return a body', () => LambdaTester(PickShapeHandler)
        .event(event)
        .expectResult((res) => {
          expect(res.body).to.exist();
        }));

      it('should return a document with a picked property', () => LambdaTester(PickShapeHandler)
        .event(event)
        .expectResult((res) => {
          expect(JSON.parse(res.body).picked).to.exist();
        }));

      it('should return only one propery', () => LambdaTester(PickShapeHandler)
        .event(event)
        .expectResult((res) => {
          expect(Object.keys(JSON.parse(res.body))).to.have.length(1);
        }));

      it('should have a picked property which is one of rock, paper or scissors', () => LambdaTester(PickShapeHandler)
        .event(event)
        .expectResult((res) => {
          expect(['rock', 'paper', 'scissors']).to.include(JSON.parse(res.body).picked);
        }));
    });

    describe('(missing required query string withPlayerMove)', () => {

      it('should callback with a 400 Bad Request', () => LambdaTester(PickShapeHandler)
        .event({ queryString: {} })
        .expectResult((res) => {
          expect(res.statusCode).to.equal(400);
          const result = JSON.parse(res.body);
          expect(result.error).to.equal('Bad Request');
          expect(result.message).to.equal('child "withPlayerMove" fails because ["withPlayerMove" is required]');
          expect(result.validation).to.deep.equal({ source: 'query', keys: ['withPlayerMove'] });
        }));
    });

    describe('(invalid value for query string withPlayerMove)', () => {

      it('should callback with a 400 Bad Request', () => LambdaTester(PickShapeHandler)
        .event({ queryString: { withPlayerMove: 'foo' } })
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
