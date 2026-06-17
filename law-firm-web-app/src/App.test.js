import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hero headline', () => {
  render(<App />);
  const titleElement = screen.getByText(/Trusted Legal/i);
  expect(titleElement).toBeInTheDocument();
});
