import '@testing-library/jest-dom';
import { setLogger } from 'react-query';
import { server } from 'test/server';
import { loadEnvConfig } from '@next/env';

// load env vars from .env.test and .env.test.local
const rootDirAbsolutePath = process.cwd();
loadEnvConfig(rootDirAbsolutePath);

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

// TypeError: URL.createObjectURL is not a function
Object.defineProperty(window.URL, 'createObjectURL', {
  value: jest.fn().mockImplementation((arg) => console.log('createObjectURL', arg)),
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
