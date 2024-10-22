import { Piece } from "../models";
import { Board } from "../models/Board";
import { TeamType } from "../Types";

const jsChessEngine = require('js-chess-engine')
const { moves, aiMove } = jsChessEngine;

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


export function toString(bestMove: { [key: string]: string }) {
  const key = Object.keys(bestMove)[0];
  return `${key} to ${bestMove[key]}`;
}

export function calculateBestMove(board: ChessEngineBoard): string {
  const newMoves = moves(board);
  const bestMove = aiMove({ ...board, moves: newMoves }, 3)
  return toString(bestMove);
}
