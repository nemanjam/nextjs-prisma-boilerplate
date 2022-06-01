/// <reference types="cypress" />
//
import { Routes } from 'lib-client/constants';

const cookieName = Cypress.env('COOKIE_NAME');

describe('Navbar', () => {
  before(() => {
    cy.clearCookies();
    cy.getCookies().should('be.empty');

    cy.task('db:seed');
    cy.loginAsAdmin();
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce(cookieName);
  });

  after(() => {
    cy.task('db:teardown');
  });

  // just for this test and postTitle var
  context('Navbar links', () => {
    beforeEach(() => {
      // home page, must be logged in
      cy.visit('/');
      // assert logged in as admin
      cy.findByText(/^log out$/i).should('exist');

      cy.get('.home__list .post-item:first-child .post-item__name')
        .first()
        .invoke('text')
        .as('userName');
      cy.get('.home__list .post-item:first-child .post-item__username')
        .first()
        .invoke('text')
        .as('userUsername');
    });

    it('navigation links work', function () {
      // remember users name and username
      const userName = this.userName as string;
      const userUsername = (this.userUsername as string).replace('@', '');
      cy.log(`userName: ${userName}, userUsername: ${this.userUsername}`);

      // profile
      cy.findByText(/^profile$/i)
        .should('exist')
        .click();
      // assert profile page
      cy.url().should('include', `/${userUsername}`);
      cy.findByRole('heading', { name: RegExp(userName, 'i') });
      // no need to go.back()

      // users
      cy.findByText(/^users$/i)
        .should('exist')
        .click();
      // assert users page
      cy.url().should('include', Routes.SITE.USERS);
      cy.findByRole('heading', { name: /^users$/i });

      // create
      cy.findByText(/^create$/i)
        .should('exist')
        .click();
      // assert create post page
      cy.url().should('include', Routes.SITE.CREATE);
      cy.findByRole('heading', { name: /create new draft/i });

      // drafts
      cy.findByText(/^drafts$/i)
        .should('exist')
        .click();
      // assert drafts page
      cy.url().should('include', Routes.SITE.DRAFTS);
      cy.findByRole('heading', { name: /my drafts/i });

      // settings
      cy.findByText(/^settings$/i)
        .should('exist')
        .click({ force: true }); // hidden
      // assert settings page
      cy.url().should('include', Routes.SITE.SETTINGS);
      cy.findByRole('heading', { name: /settings/i });
      cy.findByRole('textbox', { name: /username/i }).should('have.value', userUsername);

      // theme - separate tests
    });

    it('log out works', function () {
      cy.visit('/');

      cy.findByText(/^log out$/i)
        .should('exist')
        .click({ force: true }); // hidden
      // assert home page
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.findByRole('heading', { name: /^home$/i }).should('exist');
      // assert logged out
      cy.findByText(/^log in$/i).should('exist');
    });
  });
});
