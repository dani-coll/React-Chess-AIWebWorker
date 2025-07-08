interface IndexChessEngineBoard {
    board: ChessEngineBoard;
    index?: 1 | 2 | 3;
}

interface ChessEngineBoard {
    pieces: {};
    turn: string;
}