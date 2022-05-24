// add new command to the existing Cypress interface
declare global {
  namespace Cypress {
    interface Chainable {
      seedDbViaUI: () => void;
      loginAsAdmin: () => void;
    }
  }
}

export {};
