import '@testing-library/jest-dom';
import { Blob } from 'blob-polyfill';
import { jestPreviewConfigure } from 'jest-preview';
import { server } from 'test-client/server';
import { isGithubActionsAppEnv } from 'utils';

if (!isGithubActionsAppEnv()) {
  console.log('test-client/config/jest.setup.ts loaded...');
}

// The current testing environment is not configured to support act(…)
// doesnt work
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

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

// mock Blob with polyfill (and File)
global.Blob = Blob;

// msw
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers()); // reset only to inital list of handlers, not empty array
afterAll(() => server.close());

jestPreviewConfigure({
  // An array of relative paths from the root of your project
  // todo: fails because of Tailwind import directives
  // externalCss: ['styles/index.scss'],
});
