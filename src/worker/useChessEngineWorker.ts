import { useCallback, useEffect, useState } from "react";

export const useChessEngineWorker = (worker: Worker) => {
  const [running, setRunning] = useState(false);
  const [workerBestMove, setWorkerBestMove] = useState<string>();

  useEffect(() => {
    const onMessage = (event: MessageEvent<string>) => {
      setRunning(false);
      setWorkerBestMove(event.data);
    };

    // Main thread listens
    worker.addEventListener("message", onMessage);
    
    return () => worker.removeEventListener("message", onMessage);
  }, [worker]);

  const startProcessing = useCallback(
    (data: ChessEngineBoard) => {
      setRunning(true);
      setWorkerBestMove('')
      worker.postMessage(data); // Worker starts
    },
    [worker]
  );

  const clear = useCallback(() => {
    setWorkerBestMove('');
    setRunning(false);
  }
    , []);

  return {
    startProcessing,
    running,
    workerBestMove,
    clear
  };
};
