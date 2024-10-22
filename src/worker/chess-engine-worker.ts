import { parseBestMoveToString } from "../utils/utils";

const { aiMove } = require('js-chess-engine');

self.onmessage = (event) => {
  const result = aiMove(event.data, 3)

  return postMessage(parseBestMoveToString(result));
};
