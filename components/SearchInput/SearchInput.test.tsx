import {
  act,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { customRender } from 'test/test-utils';
import SearchInput from 'components/SearchInput';
import userEvent from '@testing-library/user-event';

// trivial component test example
describe('SearchInput', () => {
  const onSubmit = jest.fn();

  afterEach(() => {
    onSubmit.mockClear();
  });

  test('happy path search submit', async () => {
    const inputText = 'abcde';

    customRender(<SearchInput onSearchSubmit={onSubmit} />);
    await waitForElementToBeRemoved(() => screen.getAllByTestId(/loading/i));

    // get search input
    const searchInput = screen.getByRole('textbox', {
      name: /search/i,
    });

    // type 2 chars and submit
    await act(async () => {
      await userEvent.type(searchInput, inputText);
      fireEvent.submit(searchInput);
    });

    // assert inputText in onSubmit
    expect(onSubmit).toHaveBeenCalledWith(inputText);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test('between 3 and 20 chars validation', async () => {
    customRender(<SearchInput />);
    await waitForElementToBeRemoved(() => screen.getAllByTestId(/loading/i));

    // get search input
    const searchInput = screen.getByRole('textbox', {
      name: /search/i,
    });

    // type 2 chars and submit
    await act(async () => {
      await userEvent.type(searchInput, 'ab');
      fireEvent.submit(searchInput);
    });

    // assert validation error message
    expect(searchInput).toHaveErrorMessage(/must contain at least 3 character/i);

    // clear input
    userEvent.clear(searchInput);

    // type 22 chars and submit
    await act(async () => {
      await userEvent.type(searchInput, 'a'.repeat(22));
      fireEvent.submit(searchInput);
    });

    // assert validation error message
    expect(searchInput).toHaveErrorMessage(/must contain at most 20 character/i);

    // clear input
    userEvent.clear(searchInput);

    // type 5 chars and submit
    await act(async () => {
      await userEvent.type(searchInput, 'a'.repeat(5));
      fireEvent.submit(searchInput);
    });
    // should not have any error message, 1+ string
    expect(searchInput).not.toHaveErrorMessage(/.+/i);
  });
});
