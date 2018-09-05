## Overview

A rest service that serves as opponent to play the game Rock, Paper, Scissors. A front-end application picks up a shape of the game and then call this service to the GET endpoint `/play` and passing the selected shape through the query string parameter `withPlayerMove`.

Player selected shape must be one of `rock`, `paper` or `scissors`. Failing to pass a valid shape will result in a 400 Bad Request. 

The service then will randomly generate a shape as service move and will decide who win the match. The response will have the following properties: 

  * `winner`: the winner of the game if there is one (could be tie), either player 1 or `player 2``
  * `tie`: true if the 2 players played the same shape (e.g. rock vs rock). This field is mutually exclusive with winner
  * `message`: the result message of the game (e.g. paper beats rock)
  * `moves`: an object representing the moves of player 1 and player 2

### Response example in case of a winner

```javascript
{ 
  winner: 'player2', 
  message: 'paper beats rock', 
  moves: { 
    player1: 'rock', 
    player2: 'paper' 
  } 
}
```

### Response example in case of a tie

```javascript
{ 
  tie: true, 
  message: 'Tie!', 
  moves: { 
    player1: 'rock', 
    player2: 'rock' 
  } 
}
```

### Business logic

In order to determine the result of the match, the service is using an external dependency[@lucadv/rps](https://github.com/lucadv/rock-paper-scissors). This module accept 2 parameters corresponding to the 2 player's moves and contains the business logic to determine who wins the match (or if the is a tie). The same module is then used in the [front-end application](https://github.com/lucadv/rock-paper-scissors-game-front) when the user chooses a local opponent.