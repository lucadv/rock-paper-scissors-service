## Overview

A rest service that serves as opponent to play the game Rock, Paper, Scissors. A front-end application picks up a shape of the game and then call this service to the GET endpoint `/pick-shape` to retrieve a randomly generated shape. The endpoint returns a JSON document like the following: 

```javascript
{
  "picked": "rock"
}
```

The front-end application contains the logic to determine who wins.