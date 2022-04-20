import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { customRender } from 'test/test-utils';
import Footer from 'components/Footer';

// trivial component test example
describe('Footer', () => {
  test('renders', async () => {
    customRender(<Footer />);
    await waitForElementToBeRemoved(() => screen.getByTestId(/loading/i));

    // assert content
    const contentText = screen.getByText(/footer 2022/i);
    expect(contentText).toBeInTheDocument();
  });
});
