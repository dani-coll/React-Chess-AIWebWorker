import { useCallback, useEffect, useState } from "react";


export interface WorkerResponse<T> {
  result: T;
}

export const useWebWorker = <TResult, TPayload>(worker: Worker) => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<TResult>();

  const startProcessing = useCallback(
    (data: TPayload) => {
      setRunning(true);
      setResult('' as TResult)
      worker.postMessage(data);
    },
    [worker]
  );

  const clear = useCallback(() => {
    setResult('' as TResult);
    setRunning(false);
  }
    , []);

  useEffect(() => {
    const onMessage = (event: MessageEvent<WorkerResponse<TResult>>) => {
      setRunning(false);
      setResult(event.data.result);
    };
    worker.addEventListener("message", onMessage);
    return () => worker.removeEventListener("message", onMessage);
  }, [worker]);

  return {
    startProcessing,
    running,
    result,
    clear
  };
};
