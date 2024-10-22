import { Piece } from "../models";
import { Board } from "../models/Board";
import { TeamType } from "../Types";

function getPositionLetter(x: number): string {
  return String.fromCharCode(x + 65);
}

function getPieceLetter(piece: Piece): string {
  let letter = "p";
  if (piece.isKing) letter = 'k';
  if (piece.isQueen) letter = 'q';
  if (piece.isRook) letter = 'r';
  if (piece.isBishop) letter = 'b';
  if (piece.isKnight) letter = 'n';

  return piece.team === TeamType.OUR ? letter.toUpperCase() : letter;
}


export function parseBoardToChessEngine(board: Board) {
  const pieces = board.pieces.reduce((previousValue, currentPiece) => {
    return {
      ...previousValue,
      [getPositionLetter(currentPiece.position.x) + (currentPiece.position.y + 1)]: getPieceLetter(currentPiece)
    }
  }, {})
  const chessEngineBoard = {
    turn: board.totalTurns % 2 === 1 ? 'white' : 'black',
    pieces
  }

  return chessEngineBoard;
}


export function parseBestMoveToString(bestMove: any) {
  const key = Object.keys(bestMove)[0];
  return `${key} to ${bestMove[key]}`;
}
