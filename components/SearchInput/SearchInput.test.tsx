import { screen, waitFor } from '@testing-library/react';
import { customRender } from 'test-client/test-utils';
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

    // get search input
    const searchInput = await screen.findByRole('textbox', {
      name: /search/i,
    });

    // type 2 chars and submit
    await userEvent.type(searchInput, `${inputText}{enter}`);

    // assert inputText in onSubmit
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(inputText));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  test('between 3 and 20 chars validation', async () => {
    customRender(<SearchInput />);

    // get search input
    const searchInput = await screen.findByRole('textbox', { name: /search/i });

    // 1. less chars than valid ----------------

    // type 2 chars and submit
    // first time submit is needed
    await userEvent.type(searchInput, 'ab{enter}');

    // assert validation error message (must wait)
    await waitFor(() =>
      expect(searchInput).toHaveErrorMessage(/must contain at least 3 character/i)
    );

    // clear input
    await userEvent.clear(searchInput);
    await waitFor(() => expect(searchInput).toHaveValue(''));

    // 2. more chars than valid ----------------

    // type 22 chars and submit
    // this line causes validation state update, but can't wrapp it in act
    await userEvent.type(searchInput, 'a'.repeat(22));

    // no need to submit...
    // assert validation error message
    await waitFor(() =>
      expect(searchInput).toHaveErrorMessage(/must contain at most 20 character/i)
    );

    // clear input
    await userEvent.clear(searchInput);
    await waitFor(() => expect(searchInput).toHaveValue(''));

    // 3. valid number of chars removes error message ----------------

    // type 5 chars without submit
    await userEvent.type(searchInput, 'a'.repeat(5));

    // should not have any error message, 1+ string
    await waitFor(() => expect(searchInput).not.toHaveErrorMessage(/.+/i));
  });
});
