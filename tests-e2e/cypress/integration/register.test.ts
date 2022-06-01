/// <reference types="cypress" />
//
import { Routes } from 'lib-client/constants';

describe('Register page', () => {
  before(() => {
    cy.task('db:seed');
  });

  after(() => {
    cy.task('db:teardown');
  });

  const baseUrl = Cypress.config().baseUrl;
  const cookieName = Cypress.env('COOKIE_NAME');
  const newUser = {
    name: 'cypress0 user',
    username: 'cypress0',
    email: 'cypress0@email.com',
    password: '123456',
  };

  // must be logged out
  // can run only once per seed
  it('register new user and check his profile', () => {
    // check we are logged out
    cy.visit('/');
    cy.findByText(/^log in$/i).should('exist');

    // register -------------------

    // go to register page
    cy.findByText(/register/i).click();

    // assert register page
    cy.url().should('include', Routes.SITE.REGISTER);
    cy.findByRole('heading', { name: /register/i }).should('exist');

    // fill out form
    cy.findByRole('textbox', { name: /^name$/i }).type(newUser.name, { force: true });
    cy.findByRole('textbox', { name: /username/i }).type(newUser.username);
    cy.findByRole('textbox', { name: /email/i }).type(newUser.email);
    cy.findByLabelText(/^password$/i).type(newUser.password);
    cy.findByLabelText(/confirm password/i).type(newUser.password);

    cy.intercept('POST', Routes.API.USERS).as('postUser');

    // submit form
    cy.findByRole('button', { name: /register/i }).click();

    // wait http
    cy.wait('@postUser');

    // log in -------------------

    // assert login page
    cy.url().should('include', Routes.SITE.LOGIN);
    cy.findByRole('heading', { name: /login/i }).should('exist');

    // log in
    cy.findByRole('textbox', { name: /email/i }).type(newUser.email);
    cy.findByLabelText(/^password$/i).type(newUser.password);

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

    // assert cookie
    cy.getCookie(cookieName).should('exist');

    // profile page ------------------

    // go to profile page
    cy.findByText(/^profile$/i).click();

    // assert new name
    cy.findByRole('heading', { name: RegExp(newUser.name, 'i') }).should('exist');
  });
});
