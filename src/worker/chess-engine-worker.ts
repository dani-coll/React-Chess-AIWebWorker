import { calculateBestMove } from "../utils/utils";
import { WorkerResponse } from "./useWebWorker";

self.onmessage = (event) => {
  return postMessage({ result: calculateBestMove(event.data) } as WorkerResponse<string>);
};
