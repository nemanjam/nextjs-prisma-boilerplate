import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

test('renders footer', () => {
  render(<Footer />);
  const element = screen.getByText(/footer/i);
  expect(element).toBeInTheDocument();
});
