/// <reference types="cypress" />
//
// import { teardown } from 'test-server/test-client';
import { fakeUser } from 'test-client/server/fake-data';

describe('app', () => {
  before(() => {
    const timeout = 6000;
    // seed
    cy.visit('/');
    cy.findByText(/log in/i, { timeout }).should('exist');
    cy.findByRole('link', { name: /reseed/i }).click();
    cy.findByRole('link', { name: /seeding/i }).should('exist');
    cy.findByRole('link', { name: /reseed/i, timeout }).should('exist');
    cy.findByText(/log in/i).should('exist');
  });

  after(async () => {
    // truncate db
    // await teardown();
  });

  const password = '123456';

  it('entire app flow', () => {
    cy.visit('/');

    // go to login page
    cy.findByText(/log in/i).click();
    // assert login page
    cy.url().should('include', '/auth/login/');
    cy.findByRole('heading', { name: /login/i }).should('be.visible');

    // login as admin
    cy.findByRole('textbox', { name: /email/i }).type(fakeUser.email);
    cy.findByLabelText(/^password$/i).type(password);

    // submit form
    cy.findByRole('button', { name: /^login$/i }).click();

    // assert redirect to home
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.findByRole('heading', { name: /home/i });

    // wait login to reflect
    cy.findByText(/^log out$/i);
  });
});
