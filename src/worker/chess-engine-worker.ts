import { calculateBestMove } from "../utils/utils";

self.onmessage = (event) => {
  return postMessage(calculateBestMove(event.data));
};
