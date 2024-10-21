import { parseBestMoveToString } from "../utils/utils";

const { aiMove } = require('js-chess-engine');

self.onmessage = (event) => {
  const result = aiMove(event.data, 1)

  return postMessage(parseBestMoveToString(result));
};
