import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
// Example using common
import * as player from 'common/src/player';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
