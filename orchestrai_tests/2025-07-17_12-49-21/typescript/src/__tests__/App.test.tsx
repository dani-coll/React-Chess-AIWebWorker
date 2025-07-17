```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the Referee component
jest.mock('../components/Referee/Referee', () => {
  return function MockReferee() {
    return <div data-testid="referee">Referee Component</div>;
  };
});

describe('App', () => {
  beforeEach(() => {
    // Clear any mocks before each test
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('referee')).toBeInTheDocument();
  });

  test('renders main app container', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toHaveClass('App');
  });

  test('contains referee component', () => {
    render(<App />);
    expect(screen.getByTestId('referee')).toBeInTheDocument();
  });

  test('app has correct structure', () => {
    const { container } = render(<App />);
    const appDiv = container.querySelector('.App');
    expect(appDiv).toBeInTheDocument();
    expect(appDiv).toContainElement(screen.getByTestId('referee'));
  });
});
```