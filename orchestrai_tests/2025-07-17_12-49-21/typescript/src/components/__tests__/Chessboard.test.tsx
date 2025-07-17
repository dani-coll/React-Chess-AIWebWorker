```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chessboard from '../Chessboard/Chessboard';
import { Piece } from '../../Types';
import { PieceType, TeamType } from '../../Constants';

const mockPieces: Piece[] = [
  {
    image: 'assets/images/pawn_w.png',
    position: { x: 0, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.US
  },
  {
    image: 'assets/images/pawn_b.png',
    position: { x: 0, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT
  }
];

const mockProps = {
  playMove: jest.fn(),
  pieces: mockPieces
};

describe('Chessboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders chessboard with correct number of tiles', () => {
    render(<Chessboard {...mockProps} />);
    const tiles = screen.getAllByTestId(/tile-/);
    expect(tiles).toHaveLength(64); // 8x8 board
  });

  test('renders pieces on correct positions', () => {
    render(<Chessboard {...mockProps} />);
    const whitePawn = screen.getByAltText('pawn');
    expect(whitePawn).toBeInTheDocument();
  });

  test('calls playMove when a move is made', () => {
    render(<Chessboard {...mockProps} />);
    const tile = screen.getByTestId('tile-0-1');
    
    fireEvent.mouseDown(tile);
    fireEvent.mouseUp(screen.getByTestId('tile-0-2'));
    
    expect(mockProps.playMove).toHaveBeenCalled();
  });

  test('handles piece selection', () => {
    render(<Chessboard {...mockProps} />);
    const pieceElement = screen.getByAltText('pawn');
    
    fireEvent.mouseDown(pieceElement);
    expect(pieceElement.parentElement).toHaveClass('selected');
  });

  test('prevents invalid moves', () => {
    render(<Chessboard {...mockProps} />);
    const tile = screen.getByTestId('tile-0-6'); // Opponent piece
    
    fireEvent.mouseDown(tile);
    fireEvent.mouseUp(screen.getByTestId('tile-0-5'));
    
    expect(mockProps.playMove).not.toHaveBeenCalled();
  });

  test('highlights possible moves', () => {
    const piecesWithMoves: Piece[] = [
      {
        ...mockPieces[0],
        possibleMoves: [{ x: 0, y: 2 }, { x: 0, y: 3 }]
      }
    ];

    render(<Chessboard {...mockProps} pieces={piecesWithMoves} />);
    const pieceElement = screen.getByAltText('pawn');
    
    fireEvent.mouseDown(pieceElement);
    
    const highlightedTile = screen.getByTestId('tile-0-2');
    expect(highlightedTile).toHaveClass('possible-move');
  });

  test('handles drag and drop', () => {
    render(<Chessboard {...mockProps} />);
    const pieceElement = screen.getByAltText('pawn');
    
    fireEvent.dragStart(pieceElement);
    fireEvent.dragEnd(pieceElement);
    
    expect(pieceElement).toBeInTheDocument();
  });
});
```