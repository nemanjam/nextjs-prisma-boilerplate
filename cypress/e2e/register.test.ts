/// <reference types="cypress" />
//
import { fakeUser } from 'test-client/server/fake-data';
import { Routes } from 'lib-client/constants';

const cookieName = Cypress.env('COOKIE_NAME');

describe('Register page', () => {
  before(() => {
    cy.clearCookies();
    cy.getCookies().should('be.empty');

    // cy.seedDbViaUI();
    cy.task('db:seed');
    cy.loginAsAdmin();
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce(cookieName);
  });

  after(() => {
    cy.task('db:teardown');
  });

  context.skip('Register context', () => {
    beforeEach(() => {
      // home page, must be logged in
      cy.visit('/');
      // assert logged in as admin
      cy.findByText(/^log out$/i).should('exist');

      cy.get('.home__list .post-item:first-child h2').invoke('text').as('postTitle');
    });

    it('create new user works', function () {
      const postTitle = this.postTitle as string;
    });

    it('login with new user', function () {
      //
    });

    it('seed link works', function () {
      //
    });
  });
});
