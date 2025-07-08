import { Piece } from "../models";
import { Board } from "../models/Board";
import { TeamType } from "../Types";

const jsChessEngine = await import('js-chess-engine')
const { moves, aiMove } = jsChessEngine;

export type ChessEngineParams = {
    turn: string;
    pieces: {};
}

export function isEmpty(obj: any) {
    return Object.keys(obj).length === 0;
}

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

export function getBestMove(board: ChessEngineBoard, moves: Record<string, unknown>) {
  return aiMove({ ...board, moves }, 3)
}

export function calculateBestMove(board: ChessEngineParams, index?: 1 | 2 | 3) {
  switch(index) {
    case 1:
      return calculateBestMoveFirstThread(board)
    case 2:
      return calculateBestMoveSecondThread(board)
    case 3:
      return calculateBestMoveThirdThread(board)
    default:
      return calculateBestMoveAll(board);
  }
}

export function calculateBestMoveAll(board: ChessEngineBoard): string {
  const allMoves = moves(board);
  return getBestMove(board, allMoves);
}

export function calculateBestMoveFirstThread(board: ChessEngineBoard): string {
  const allMoves = moves(board);
  const myMoves = Object.fromEntries(
    Object.entries(allMoves).slice(0, Math.floor(Object.entries(allMoves).length / 3))
  );
  return getBestMove(board, myMoves);
}

export function calculateBestMoveSecondThread(board: ChessEngineBoard): string {
  const allMoves = moves(board);
  const myMoves = Object.fromEntries(
    Object.entries(allMoves).slice(Math.floor(Object.entries(allMoves).length / 3), Math.floor(2 * Object.entries(allMoves).length / 3))
  );
    console.log(myMoves)

  return getBestMove(board, myMoves);
}

export function calculateBestMoveThirdThread(board: ChessEngineBoard): string {
  const allMoves = moves(board);
  const myMoves = Object.fromEntries(
    Object.entries(allMoves).slice(Math.floor(2 * Object.entries(allMoves).length / 3))
  );
    console.log(myMoves)

  return getBestMove(board, myMoves);
}
