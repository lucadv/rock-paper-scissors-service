const Pickme = require('@lucadv/pickme');

module.exports = () => {
  const shape = new Pickme(['rock', 'paper', 'scissors']).pickOne();
  return {
    picked: shape
  };
};
