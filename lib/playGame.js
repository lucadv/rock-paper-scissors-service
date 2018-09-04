const RPS = require('@lucadv/rock-paper-scissors');
// server shape gets picked randomly using @lucadv/pickme
module.exports = playerMove => RPS(playerMove);
