import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the HR dashboard shell', () => {
  render(<App />);
  expect(screen.getByText('CompanyOS')).toBeInTheDocument();
  expect(screen.getByText('Make talent movement visible')).toBeInTheDocument();
});

test('renders Employee Portal when navigating to /employee/dashboard', () => {
  window.history.pushState({}, 'Employee Dashboard', '/employee/dashboard');
  render(<App />);
  expect(screen.getByText('Employee Intelligence Dashboard')).toBeInTheDocument();
  expect(screen.getByText('Personal Talent Portal')).toBeInTheDocument();
});
