import { calculateBestMove } from "../utils/utils";

const doWork = (event: MessageEvent<ChessEngineBoard>) => {
  return postMessage(calculateBestMove(event.data));
};

self.onmessage = doWork;
