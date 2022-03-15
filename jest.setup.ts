import '@testing-library/jest-dom';
import { setLogger } from 'react-query';

// add msw server...

// silence react-query errors
setLogger({
  log: console.log,
  warn: console.warn,
  error: () => {},
});
