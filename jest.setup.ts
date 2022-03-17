import '@testing-library/jest-dom';
import { setLogger } from 'react-query';
import { server } from 'test/server';

// TypeError: window.matchMedia is not a function
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// silence react-query errors
setLogger({
  log: console.log,
  warn: console.warn,
  error: () => {},
});
