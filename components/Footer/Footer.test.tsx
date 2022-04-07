import { screen } from '@testing-library/react';
import { customRender } from 'test/test-utils';
import Footer from 'components/Footer';

// trivial component test example
describe('Footer', () => {
  test('renders', () => {
    customRender(<Footer />);

    // assert content
    const contentText = screen.getByText(/footer 2022/i);
    expect(contentText).toBeInTheDocument();
  });
});
