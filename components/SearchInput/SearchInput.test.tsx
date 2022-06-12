import { act, fireEvent, screen, waitFor } from '@testing-library/react';
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
    await userEvent.type(searchInput, inputText);
    act(() => {
      fireEvent.submit(searchInput);
    });

    // assert inputText in onSubmit
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(inputText));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  test('between 3 and 20 chars validation', async () => {
    customRender(<SearchInput />);

    // get search input
    const searchInput = await screen.findByRole('textbox', {
      name: /search/i,
    });

    // type 2 chars and submit
    await userEvent.type(searchInput, 'ab');
    act(() => {
      fireEvent.submit(searchInput);
    });

    // assert validation error message
    await waitFor(() =>
      expect(searchInput).toHaveErrorMessage(/must contain at least 3 character/i)
    );

    // todo: fix warnings

    // clear input
    await userEvent.clear(searchInput);
    expect(searchInput).toHaveValue('');

    // type 22 chars and submit
    await userEvent.type(searchInput, 'a'.repeat(22));
    act(() => {
      fireEvent.submit(searchInput);
    });

    // assert validation error message
    await waitFor(() =>
      expect(searchInput).toHaveErrorMessage(/must contain at most 20 character/i)
    );

    // clear input
    await userEvent.clear(searchInput);
    expect(searchInput).toHaveValue('');

    // type 5 chars and submit
    await userEvent.type(searchInput, 'a'.repeat(5));
    act(() => {
      fireEvent.submit(searchInput);
    });
    // should not have any error message, 1+ string
    await waitFor(() => expect(searchInput).not.toHaveErrorMessage(/.+/i));
  });
});
