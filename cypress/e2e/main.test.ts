/// <reference types="cypress" />
//
// import { teardown } from 'test-server/test-client';
import { fakeUser } from 'test-client/server/fake-data';

describe('app', () => {
  before(() => {
    const timeout = 6000;
    // seed
    // cy.visit('/');
    // cy.findByText(/log in/i, { timeout }).should('exist');
    // cy.findByRole('link', { name: /reseed/i }).click();
    // cy.findByRole('link', { name: /seeding/i, timeout }).should('exist');
    // cy.findByRole('link', { name: /reseed/i, timeout }).should('exist');
    // cy.findByText(/log in/i).should('exist');
  });

  after(async () => {
    // truncate db
    // await teardown();
  });

  const password = '123456';

  it('entire app flow', () => {
    const timeout = 10000;

    cy.visit('/');

    // -----------
    // login

    // go to login page
    cy.findByText(/log in/i, { timeout })
      .should('exist')
      .click();

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

    // --------------
    // test search

    // assert first post
    cy.get('.post-item')
      .first()
      .within(() => {
        cy.findByRole('link', { name: /^@user1$/i }).should('not.exist');
      });

    // search for user1
    cy.findByRole('textbox', { name: /search/i }).type('user1{enter}');

    // better instead of wait()
    cy.get('.search').should('not.contain', 'Fetching');

    // assert first post again
    cy.get('.post-item')
      .first()
      .within(() => {
        cy.findByRole('link', { name: /^@user1$/i }).should('exist');
      });

    // clear
    cy.findByRole('textbox', { name: /search/i })
      .clear()
      .type('{enter}');

    // inital list
    cy.get('.post-item')
      .first()
      .within(() => {
        cy.findByRole('link', { name: /^@user1$/i }).should('not.exist');
      });
  });
});
