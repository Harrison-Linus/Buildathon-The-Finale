import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the HR dashboard shell', () => {
  render(<App />);
  expect(screen.getByText('CompanyOS')).toBeInTheDocument();
  expect(screen.getByText('Make talent movement visible')).toBeInTheDocument();
});
