import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRender } from 'test/test-utils';
import HomeView from 'views/Home';

describe('Home View', () => {
  test('renders title, pagination section and posts list', () => {
    customRender(<HomeView />);
  });
});
