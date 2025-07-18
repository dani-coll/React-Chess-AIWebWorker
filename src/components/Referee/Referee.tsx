import { Howl } from "howler";
import { useMemo, useRef, useState } from "react";
import { initialBoard } from "../../Constants";
import { Piece, Position } from "../../models";
import { Board } from "../../models/Board";
import { Pawn } from "../../models/Pawn";
import { PieceType, TeamType } from "../../Types";
import { calculateBestMove, parseBoardToChessEngine as parseUIBoardToChessEngine } from "../../utils/utils";
import Chessboard from "../Chessboard/Chessboard";
import "./Referee.css";

import React from 'react';
import { useChessEngineWorker } from "../../worker/useChessEngineWorker";

const moveSound = new Howl({
  src: ["/sounds/move-self.mp3"],
});

const captureSound = new Howl({
  src: ["/sounds/capture.mp3"],
});

const checkmateSound = new Howl({
  src: ["/sounds/move-check.mp3"],
});

export default function Referee() {
  const [board, setBoard] = useState<Board>(initialBoard.clone());
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const modalRef = useRef<HTMLDivElement>(null);
  const checkmateModalRef = useRef<HTMLDivElement>(null);
  const [mainThreadBestMove, setMainThreadBestMove] = useState('')
  const [loading, setLoading] = useState(false)

  // Initialize worker
  const workerInstance = useMemo(
    () => new Worker(
      new URL('../../worker/chess-engine-worker', import.meta.url), 
      { type: 'module'}
    ), []);

  const {
    running,
    workerBestMove,
    clear,
    startProcessing: startWebWorker,
  } = useChessEngineWorker(workerInstance);

  function playMove(playedPiece: Piece, destination: Position): boolean {
    // If the playing piece doesn't have any moves return
    if (playedPiece.possibleMoves === undefined) return false;

    // Prevent the inactive team from playing
    if (playedPiece.team === TeamType.OUR && board.totalTurns % 2 !== 1)
      return false;
    if (playedPiece.team === TeamType.OPPONENT && board.totalTurns % 2 !== 0)
      return false;

    let playedMoveIsValid = false;

    const validMove = playedPiece.possibleMoves?.some((m) =>
      m.samePosition(destination)
    );

    if (!validMove) return false;

    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    // playMove modifies the board thus we
    // need to call setBoard
    setBoard(() => {
      const clonedBoard = board.clone();
      clonedBoard.totalTurns += 1;
      // Playing the move
      playedMoveIsValid = clonedBoard.playMove(
        enPassantMove,
        validMove,
        playedPiece,
        destination
      );

      if (playedMoveIsValid) {
        moveSound.play();
      }

      if (clonedBoard.winningTeam !== undefined) {
        checkmateModalRef.current?.classList.remove("hidden");
        checkmateSound.play();
      }

      return clonedBoard;
    });

    setMainThreadBestMove('');
    clear();

    // This is for promoting a pawn
    let promotionRow = playedPiece.team === TeamType.OUR ? 7 : 0;

    if (destination.y === promotionRow && playedPiece.isPawn) {
      modalRef.current?.classList.remove("hidden");
      setPromotionPawn((previousPromotionPawn) => {
        const clonedPlayedPiece = playedPiece.clone();
        clonedPlayedPiece.position = destination.clone();
        return clonedPlayedPiece;
      });
    }

    return playedMoveIsValid;
  }

  function isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = board.pieces.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.isPawn &&
            (p as Pawn).enPassant
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) {
      return;
    }

    setBoard((previousBoard) => {
      const clonedBoard = board.clone();
      clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
        if (piece.samePiecePosition(promotionPawn)) {
          results.push(
            new Piece(piece.position.clone(), pieceType, piece.team, true)
          );
        } else {
          results.push(piece);
        }
        return results;
      }, [] as Piece[]);

      clonedBoard.calculateAllMoves();

      return clonedBoard;
    });

    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.OUR ? "w" : "b";
  }

  function restartGame() {
    checkmateModalRef.current?.classList.add("hidden");
    setBoard(initialBoard.clone());
  }

  function startMainThread(chessEngineBoard: ChessEngineBoard) {
    setLoading(true)
    setMainThreadBestMove(calculateBestMove(chessEngineBoard));
    setLoading(false)
  }

  function calculateBestMoveMainThread() {
    const chessEngineBoard = parseUIBoardToChessEngine(board);
    startMainThread(chessEngineBoard)
  }

  function calculateBestMoveWebWorker() {
    const chessEngineBoard = parseUIBoardToChessEngine(board);
    startWebWorker(chessEngineBoard)
  }

  return (
    <>
      <div className="best-move-container">
        <img className={`spinning-icon ${running || loading ? 'loading' : ''}`} src="/dynatrace.png" width="50"></img>
        <button className="best-move-button main-thread" onClick={calculateBestMoveMainThread}>Calculate (Main thread)</button>
        <div className="best-move">Best move: <div><b>{workerBestMove || mainThreadBestMove}</b></div></div>
        <button className="best-move-button web-worker" onClick={calculateBestMoveWebWorker}>Calculate (Web Worker)</button>
      </div>
      <div className="modal hidden" ref={modalRef}>
        <div className="modal-body">
          <img
            onClick={() => promotePawn(PieceType.ROOK)}
            src={`/assets/images/rook_${promotionTeamType()}.png`}
          />
          <img
            onClick={() => promotePawn(PieceType.BISHOP)}
            src={`/assets/images/bishop_${promotionTeamType()}.png`}
          />
          <img
            onClick={() => promotePawn(PieceType.KNIGHT)}
            src={`/assets/images/knight_${promotionTeamType()}.png`}
          />
          <img
            onClick={() => promotePawn(PieceType.QUEEN)}
            src={`/assets/images/queen_${promotionTeamType()}.png`}
          />
        </div>
      </div>
      <div className="modal hidden" ref={checkmateModalRef}>
        <div className="modal-body">
          <div className="checkmate-body">
            <span>
              The winning team is{" "}
              {board.winningTeam === TeamType.OUR ? "white" : "black"}!
            </span>
            <button onClick={restartGame}>Play again</button>
          </div>
        </div>
      </div>
      <Chessboard playMove={playMove} pieces={board.pieces} />
    </>
  );
}
