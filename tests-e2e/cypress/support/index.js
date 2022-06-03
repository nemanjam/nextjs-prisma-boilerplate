// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// my imports
// important: js file, must use relative path, not included in tsconfig.json
import { Routes } from '../../../lib-client/constants';
const fakeUser = require('../fixtures/fakeUser');

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on('uncaught:exception', (err, runnable) => {
  // Error: Minified React error #421
  // This Suspense boundary received an update before it finished hydrating.
  if (err.message.includes('Minified React error #421')) {
    return false;
  }
});

Cypress.Commands.add('seedDbViaUI', () => {
  const seedDbViaUI = () => {
    cy.intercept('POST', Routes.API.SEED).as('postSeed');
    cy.intercept('POST', '/api/auth/signout').as('postSignOut');

    // seed
    cy.visit('/');

    cy.findByText(/^log in$/i).should('exist');
    cy.findByRole('link', { name: /reseed/i }).click();
    cy.wait('@postSeed');

    cy.findByRole('link', { name: /reseed/i }).should('exist');
    cy.findByText(/log in/i).should('exist');

    // wait for sign out to finish
    cy.wait('@postSignOut');

    cy.log('seed db success');
  };

  seedDbViaUI();
});

Cypress.Commands.add('loginAsAdmin', () => {
  //
  const password = '123456';
  const cookieName = Cypress.env('COOKIE_NAME');
  const baseUrl = Cypress.config().baseUrl;

  const loginAsAdmin = () => {
    cy.visit('/');

    // -----------
    // login

    // go to login page
    cy.findByText(/log in/i)
      .should('exist')
      .click();

    // assert login page
    cy.url().should('include', Routes.SITE.LOGIN);
    cy.findByRole('heading', { name: /login/i }).should('be.visible');

    // login as admin
    cy.findByRole('textbox', { name: /email/i }).type(fakeUser.email);
    cy.findByLabelText(/^password$/i).type(password);

    cy.intercept('POST', '/api/auth/callback/credentials/').as('postLogin');

    // submit form
    cy.findByRole('button', { name: /^login$/i }).click();

    // wait http
    cy.wait('@postLogin');

    // assert redirect to home
    cy.url().should('eq', baseUrl + '/');
    cy.findByRole('heading', { name: /^home$/i }).should('exist');

    // wait login to reflect
    cy.findByText(/^log out$/i).should('exist');

    cy.log('login as admin success');
    cy.getCookie(cookieName).should('exist');
  };

  loginAsAdmin();
});
