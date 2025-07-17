```typescript
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  GRID_SIZE,
  PieceType,
  TeamType,
  INITIAL_BOARD_STATE
} from '../Constants';

describe('Constants', () => {
  describe('VERTICAL_AXIS', () => {
    test('should contain 8 elements', () => {
      expect(VERTICAL_AXIS).toHaveLength(8);
    });

    test('should contain numbers 1-8 as strings', () => {
      expect(VERTICAL_AXIS).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
    });
  });

  describe('HORIZONTAL_AXIS', () => {
    test('should contain 8 elements', () => {
      expect(HORIZONTAL_AXIS).toHaveLength(8);
    });

    test('should contain letters a-h', () => {
      expect(HORIZONTAL_AXIS).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
    });
  });

  describe('GRID_SIZE', () => {
    test('should be 8', () => {
      expect(GRID_SIZE).toBe(8);
    });
  });

  describe('PieceType', () => {
    test('should contain all chess piece types', () => {
      expect(PieceType.PAWN).toBeDefined();
      expect(PieceType.BISHOP).toBeDefined();
      expect(PieceType.KNIGHT).toBeDefined();
      expect(PieceType.ROOK).toBeDefined();
      expect(PieceType.QUEEN).toBeDefined();
      expect(PieceType.KING).toBeDefined();
    });

    test('should have correct enum values', () => {
      expect(Object.keys(PieceType)).toHaveLength(6);
    });
  });

  describe('TeamType', () => {
    test('should contain OPPONENT and US', () => {
      expect(TeamType.OPPONENT).toBeDefined();
      expect(TeamType.US).toBeDefined();
    });

    test('should have exactly 2 team types', () => {
      expect(Object.keys(TeamType)).toHaveLength(2);
    });
  });

  describe('INITIAL_BOARD_STATE', () => {
    test('should be defined', () => {
      expect(INITIAL_BOARD_STATE).toBeDefined();
    });

    test('should be an array', () => {
      expect(Array.isArray(INITIAL_BOARD_STATE)).toBe(true);
    });

    test('should contain 32 pieces initially', () => {
      expect(INITIAL_BOARD_STATE).toHaveLength(32);
    });
  });
});
```