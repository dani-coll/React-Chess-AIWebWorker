import { calculateBestMove } from "../utils/utils";

const doWork = (event: MessageEvent<IndexChessEngineBoard>) => {
  const result = calculateBestMove(event.data.board, event.data.index);
  console.log(result)
  return postMessage(result);
};

self.onmessage = doWork;
