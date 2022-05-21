/// <reference types="cypress" />
//
// import { teardown } from 'test-server/test-client';
import { fakeUser } from 'test-client/server/fake-data';
import { Routes } from 'lib-client/constants';

describe('app', () => {
  before(() => {
    const timeout = 6000;
    cy.intercept('POST', Routes.API.SEED).as('postSeed');
    cy.intercept('POST', '/api/auth/signout').as('postSignOut');

    // seed
    cy.visit('/');

    cy.findByText(/log in/i, { timeout }).should('exist');
    cy.findByRole('link', { name: /reseed/i }).click();
    cy.wait('@postSeed');

    cy.findByRole('link', { name: /reseed/i, timeout }).should('exist');
    cy.findByText(/log in/i).should('exist');

    // wait for sign out to finish
    cy.wait('@postSignOut');
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

    // needed for wait()
    cy.intercept('GET', `${Routes.API.POSTS}*`).as('searchPosts');

    // assert first post
    cy.get('.post-item')
      .first()
      .within(() => {
        cy.findByRole('link', { name: /^@user1$/i }).should('not.exist');
      });

    // search for user1
    cy.findByRole('textbox', { name: /search/i }).type('user1{enter}');

    // wait for http request
    cy.wait('@searchPosts');

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

    // dont wait for http request, its cached in React Query

    // inital list
    cy.get('.post-item')
      .first()
      .within(() => {
        cy.findByRole('link', { name: /^@user1$/i }).should('not.exist');
      });
  });
});
