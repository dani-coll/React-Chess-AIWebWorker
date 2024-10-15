import { useMemo } from 'react';
import './App.css';
import Referee from './components/Referee/Referee';
import { useWebWorker } from './worker/useWebWorker';

function App() {
  const boardConfiguration = {
    "turn": "black",
    "pieces": {
        "E1": "K",
        "C1": "B",
        "E8": "k"
    },
    "moves": {
      "E8": ["E7", "F8", "F7", "D8", "D7"]
    },
    "isFinished": false,
    "check": false,
    "checkMate": false,
    "castling": {
        "whiteLong": true,
        "whiteShort": true,
        "blackLong": true,
        "blackShort": true    
    },
    "enPassant": "E6",
    "halfMove": 0,
    "fullMove": 1
}

  const workerInstance = useMemo(() => new Worker(new URL('./worker/chess-engine-worker', import.meta.url)), []);

  const {
    running,
    error,
    result,
    startProcessing,
  } = useWebWorker<any, any>(workerInstance);



  console.log(result);

  const start = () => {
    startProcessing(boardConfiguration);
  }

  return (
    <div id="app">
      <input></input>
      <button onClick={start}> CLICK ME</button>
      <Referee></Referee>
    </div>
  );
}

export default App;
