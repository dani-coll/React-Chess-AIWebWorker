```typescript
import { Position, Piece, Move } from '../Types';
import { PieceType, TeamType } from '../Constants';

describe('Types', () => {
  describe('Position', () => {
    test('should create position with x and y coordinates', () => {
      const position: Position = { x: 4, y: 4 };
      expect(position.x).toBe(4);
      expect(position.y).toBe(4);
    });

    test('should allow different coordinate values', () => {
      const position: Position = { x: 0, y: 7 };
      expect(position.x).toBe(0);
      expect(position.y).toBe(7);
    });
  });

  describe('Piece', () => {
    test('should create piece with required properties', () => {
      const piece: Piece = {
        image: 'pawn.png',
        position: { x: 0, y: 1 },
        type: PieceType.PAWN,
        team: TeamType.US
      };

      expect(piece.image).toBe('pawn.png');
      expect(piece.position).toEqual({ x: 0, y: 1 });
      expect(piece.type).toBe(PieceType.PAWN);
      expect(piece.team).toBe(TeamType.US);
    });

    test('should create piece with optional properties', () => {
      const piece: Piece = {
        image: 'king.png',
        position: { x: 4, y: 0 },
        type: PieceType.KING,
        team: TeamType.US,
        enPassant: false,
        possibleMoves: [{ x: 4, y: 1 }]
      };

      expect(piece.enPassant).toBe(false);
      expect(piece.possibleMoves).toHaveLength(1);
      expect(piece.possibleMoves![0]).toEqual({ x: 4, y: 1 });
    });
  });

  describe('Move', () => {
    test('should create move with required properties', () => {
      const move: Move = {
        playedPiece: {
          image: 'pawn.png',
          position: { x: 0, y: 1 },
          type: PieceType.PAWN,
          team: TeamType.US
        },
        destination: { x: 0, y: 2 }
      };

      expect(move.playedPiece.type).toBe(PieceType.PAWN);
      expect(move.destination).toEqual({ x: 0, y: 2 });
    });

    test('should create move with optional capturedPiece', () => {
      const capturedPiece: Piece = {
        image: 'pawn.png',
        position: { x: 1, y: 2 },
        type: PieceType.PAWN,
        team: TeamType.OPPONENT
      };

      const move: Move = {
        playedPiece: {
          image: 'pawn.png',
          position: { x: 0, y: 1 },
          type: PieceType.PAWN,
          team: TeamType.US
        },
        destination: { x: 1, y: 2 },
        capturedPiece
      };

      expect(move.capturedPiece).toBeDefined();
      expect(move.capturedPiece!.team).toBe(TeamType.OPPONENT);
    });
  });
});
```