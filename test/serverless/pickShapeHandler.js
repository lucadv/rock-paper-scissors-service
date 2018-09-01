const Code = require('code');
const Lab = require('lab');
const LambdaTester = require('lambda-tester');
const PickShapeHandler = require('../../serverless/handlers').pickShape;

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('Serverless tests', () => {

  describe('pickShape function', () => {

    it('should return a document with a picked property', () => LambdaTester(PickShapeHandler)
      .expectResult((res) => {
        expect(res.picked).to.exist();
      }));

    it('should return only one propery', () => LambdaTester(PickShapeHandler)
      .expectResult((res) => {
        expect(Object.keys(res)).to.have.length(1);
      }));

    it('should have a picked property which is one of rock, paper or scissors', () => LambdaTester(PickShapeHandler)
      .expectResult((res) => {
        expect(['rock', 'paper', 'scissors']).to.include(res.picked);
      }));
  });
});
