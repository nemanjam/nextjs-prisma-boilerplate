// add new command to the existing Cypress interface
declare global {
  namespace Cypress {
    interface Chainable {
      seedDb: () => void;
      loginAsAdmin: () => void;
    }
  }
}

export {};
