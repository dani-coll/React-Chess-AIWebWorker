/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-anonymous-default-export */


/* eslint-disable no-undef */


const jsChessEngine = require('js-chess-engine')

self.onmessage = (e) => {
  try {
    const { aiMove } = jsChessEngine;
    console.log("Received: ", e.data)
    const game = new jsChessEngine.Game()
    const initialGame = game.exportJson();
    console.log(initialGame)
    const result = aiMove(initialGame, 1)

    return postMessage({result});
  } catch (error) {
    console.log(error)
    return postMessage({ error });
  }
};
