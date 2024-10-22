import { useCallback, useEffect, useState } from "react";


export const useWebWorker = (worker: Worker) => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string>();

  const startProcessing = useCallback(
    (data: any) => {
      setRunning(true);
      setResult('')
      worker.postMessage(data);
    },
    [worker]
  );

  const clear = useCallback(() => {
    setResult('');
    setRunning(false);
  }
    , []);

  useEffect(() => {
    const onMessage = (event: MessageEvent<string>) => {
      setRunning(false);
      setResult(event.data);
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
