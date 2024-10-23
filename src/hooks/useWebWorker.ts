import { useState } from "react";

export const useWebWorker = <TResult, TPayload>(worker: Worker) => {
    const [result, setResult] = useState<TResult>();
    const [loadingWorker, setLoadingWorker] = useState(false);

    const startProcessingWorker = (payload: TPayload) => {
        setLoadingWorker(true);
        worker.postMessage(payload)
    }

    const onMessage = (event: MessageEvent<TResult>) => {
        setResult(event.data)
        setLoadingWorker(false)
    }

    worker.addEventListener("message", onMessage);

    return {
        result,
        loadingWorker,
        startProcessingWorker
    }
}