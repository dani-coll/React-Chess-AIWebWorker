import { calculateBestMove } from "../utils/utils"

self.onmessage = (event: MessageEvent<ChessEngineBoard>) => {
    const bestMove = calculateBestMove(event.data)
    postMessage('')
}