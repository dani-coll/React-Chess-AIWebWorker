import { useCallback, useEffect, useState } from "react";
import { calculateBestMove, ChessEngineParams, getBestMove, isEmpty, toString } from "../utils/utils";

export const useChessEngineWorker = (worker1: Worker, worker2: Worker, worker3: Worker) => {
  const [running, setRunning] = useState(false);
  const [worker1BestMove, setWorker1BestMove] = useState<Record<string,string>>({});
  const [worker2BestMove, setWorker2BestMove] = useState<Record<string,string>>({});
  const [worker3BestMove, setWorker3BestMove] = useState<Record<string,string>>({});
  const [workerBestMove, setWorkerBestMove] = useState<string>();
  const [board, setBoard] = useState<ChessEngineBoard>();

  useEffect(() => {
    const onMessage1 = (event: MessageEvent<Record<string,string>>) => {
      console.log("Thread 1 best move: ", event.data)
      setWorker1BestMove(event.data);
    };
    const onMessage2 = (event: MessageEvent<Record<string,string>>) => {
      console.log("Thread 2 best move: ", event.data)
      setWorker2BestMove(event.data);
    };
    const onMessage3 = (event: MessageEvent<Record<string,string>>) => {
      console.log("Thread 3 best move: ", event.data)
      setWorker3BestMove(event.data);
    };

    // Main thread listens
    worker1.addEventListener("message", onMessage1);
    worker2.addEventListener("message", onMessage2);
    worker3.addEventListener("message", onMessage3);

    return () =>  {
        worker1.removeEventListener("message", onMessage1);
        worker2.removeEventListener("message", onMessage2);
        worker3.removeEventListener("message", onMessage3);
    }
  }, [worker1, worker2, worker3]);

  const startProcessing = useCallback(
    (board: ChessEngineBoard) => {
      clear();
      setRunning(true);
      setBoard(board);
      worker1.postMessage({ board, index: 1} );
      worker2.postMessage({ board, index: 2} );
      worker3.postMessage({ board, index: 3} );
    },
    [worker1, worker2, worker3]
  );

  const clear = useCallback(() => {
    setWorker1BestMove({});
    setWorker2BestMove({});
    setWorker3BestMove({});
    setBoard(undefined);
    setRunning(false);
  }
    , []);

    useEffect(() => {
        if(!isEmpty(worker1BestMove) && !isEmpty(worker2BestMove) && !isEmpty(worker3BestMove) && board) {
            setWorkerBestMove(toString(getBestMove(board, {...worker1BestMove, ...worker2BestMove, ...worker3BestMove})));
            setRunning(false);
        }
    }, [worker1BestMove, worker2BestMove, worker3BestMove])

  return {
    startProcessing,
    running,
    workerBestMove,
    clear
  };
};
