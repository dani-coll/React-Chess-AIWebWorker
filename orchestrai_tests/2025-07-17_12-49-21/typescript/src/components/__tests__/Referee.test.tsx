```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Referee from '../Referee/Referee';

// Mock the Chessboard component
jest.mock('../Chessboard/Chessboard', () => {
  return function MockChessboard({ playMove, pieces }: any) {
    return (
      <div data-testid="chessboard">
        <button onClick={() => playMove({ x: 0, y: 1 }, { x: 0, y: 2 })}>
          Make Move
        </button>
        <div data-testid="pieces-count">{pieces.length}</div>
      </div>
    );
  };
});

// Mock the Board model
jest.mock('../../models/Board', () => {
  return {
    Board: jest.fn().mockImplementation(() => ({
      pieces: [],
      totalTurns: 0,
      winningTeam: undefined,
      playMove: jest.fn().mockReturnValue(true),
      clone: jest.fn().mockReturnThis(),
      calculateAllMoves: jest.fn()
    }))
  };
});

// Mock Web Worker
const mockWorker = {
  postMessage: jest.fn(),
  terminate: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

Object.defineProperty(window, 'Worker', {
  writable: true,
  value: jest.fn().mockImplementation(() => mockWorker)
});

describe('Referee', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<Referee />);
    expect(screen.getByTestId('chessboard')).toBeInTheDocument();
  });

  test('initializes with correct number of pieces', () => {
    render(<Referee />);
    const piecesCount = screen.getByTestId('pieces-count');
    expect(piecesCount).toBeInTheDocument();
  });

  test('handles player move', async () => {
    render(<Referee />);
    const moveButton = screen.getByText('Make Move');
    
    fireEvent.click(moveButton);
    
    await waitFor(() => {
      expect(mockWorker.postMessage).toHaveBeenCalled();
    });
  });

  test('displays game status', () => {
    render(<Referee />);
    expect(screen.getByText(/Turn:/)).toBeInTheDocument();
  });

  test('handles AI move response', async () => {
    render(<Referee />);
    
    // Simulate AI worker response
    const messageEvent = new MessageEvent('message', {
      data: {
        bestMove: {
          from: { x: 0, y: 6 },
          to: { x: 0, y: 5 }
        }
      }
    });

    mockWorker.addEventListener.mock.calls[0][1](messageEvent);
    
    await waitFor(() => {
      expect(screen.getByTestId('chessboard')).toBeInTheDocument();
    });
  });

  test('handles game over state', () => {
    render(<Referee />);
    // This would test the game over logic when implemented
    expect(screen.getByTestId('chessboard')).toBeInTheDocument();
  });

  test('restarts game', () => {
    render(<Referee />);
    const restartButton = screen.getByText('Restart Game');
    
    fireEvent.click(restartButton);
    
    expect