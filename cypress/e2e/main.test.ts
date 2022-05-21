/// <reference types="cypress" />
//
// import { teardown } from 'test-server/test-client';
import { fakeUser } from 'test-client/server/fake-data';
import { Routes } from 'lib-client/constants';

const password = '123456';

describe('app', () => {
  before(() => {
    cy.intercept('POST', Routes.API.SEED).as('postSeed');
    cy.intercept('POST', '/api/auth/signout').as('postSignOut');

    // seed
    cy.visit('/');

    cy.findByText(/log in/i).should('exist');
    cy.findByRole('link', { name: /reseed/i }).click();
    cy.wait('@postSeed');

    cy.findByRole('link', { name: /reseed/i }).should('exist');
    cy.findByText(/log in/i).should('exist');

    // wait for sign out to finish
    cy.wait('@postSignOut');
  });

  after(async () => {
    // truncate db
    // await teardown();
  });

  it('login as admin works', () => {
    cy.visit('/');

    // -----------
    // login

    // go to login page
    cy.findByText(/log in/i)
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
  });

  it('search works', () => {
    // --------------
    // test search, logged out
    cy.visit('/');

    // wait for navbar to load
    cy.findByText(/log in/i).should('exist');

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

  it('pagination works', () => {
    // -----------
    // test pagination, logged out
    cy.visit('/');

    // wait for navbar to load
    cy.findByText(/log in/i).should('exist');

    cy.findByRole('button', { name: /1/i }).should('have.class', 'button--primary');
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByRole('button', { name: /2/i }).should('have.class', 'button--primary');
    cy.findByRole('button', { name: /prev/i }).click();
    cy.findByRole('button', { name: /1/i }).should('have.class', 'button--primary');
  });

  // home: edit btn, delete btn, nabar links, post link, user link
  // post: edit, delete
  // profile: render
  // settings, create
  // register
  // log out
});
