/// <reference types="cypress" />
//
import { fakeUser } from 'test-client/server/fake-data';
import { Routes } from 'lib-client/constants';

const cookieName = Cypress.env('COOKIE_NAME');

describe('Post:id page', () => {
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

  // just for this test and postTitle var
  context('post page', () => {
    beforeEach(() => {
      // home page, must be logged in
      cy.visit('/');
      // assert logged in as admin
      cy.findByText(/^log out$/i).should('exist');

      cy.get('.home__list .post-item:first-child h2').invoke('text').as('postTitle');
    });

    // MUST use function() instead of () => {} for this
    it('edit post button works', function () {
      // remember title
      const postTitle = this.postTitle as string;

      // click title
      cy.findByRole('heading', { name: RegExp(postTitle, 'i') })
        .should('exist')
        .click();

      // assert we left Home page because of same heading
      cy.findByRole('heading', { name: /home/i }).should('not.exist');

      // assert post page
      cy.url().should('match', RegExp(`/${fakeUser.username}/post/\\d+`, 'i'));
      cy.findByRole('heading', { name: RegExp(postTitle, 'i') }).should('exist');
      cy.log('arrived on Post page');

      cy.log('Edit postTitle:' + postTitle);

      // click edit
      cy.findByText(/^edit$/i)
        .should('exist')
        .click();

      // assert create/edit post page
      cy.url().should('match', /\/post\/create\/\d+/i);
      cy.log('arrived on Edit page');

      cy.findByRole('heading', { name: /edit post/i }).should('exist');
      cy.findByRole('textbox', { name: /title/i }).should('have.value', postTitle);

      // must be before click()
      cy.intercept('PATCH', `${Routes.API.POSTS}*`).as('patchPost');

      // edit title
      const editedTitle = `Edited: ${postTitle}`;
      cy.findByRole('textbox', { name: /title/i }).clear().type(editedTitle);
      cy.findByRole('button', { name: /update/i }).click();

      cy.wait('@patchPost');

      // assert post page with edited title
      cy.url().should('match', RegExp(`/${fakeUser.username}/post/\\d+`, 'i'));
      cy.findByRole('heading', { name: RegExp(editedTitle, 'i') }).should('exist');
    });

    it('delete post button works', function () {
      // remember title
      const postTitle = this.postTitle as string;

      // click title
      cy.findByRole('heading', { name: RegExp(postTitle, 'i') })
        .should('exist')
        .click();

      // assert we left Home page because of same heading
      cy.findByRole('heading', { name: /home/i }).should('not.exist');

      // assert post page
      cy.url().should('match', RegExp(`/${fakeUser.username}/post/\\d+`, 'i'));
      cy.findByRole('heading', { name: RegExp(postTitle, 'i') }).should('exist');
      cy.log('arrived on Post page');

      cy.log('Delete postTitle:' + postTitle);

      cy.intercept('DELETE', `${Routes.API.POSTS}*`).as('deletePost');

      // click delete
      cy.findByText(/^delete$/i)
        .should('exist')
        .click();

      cy.wait('@deletePost');

      // assert Home page
      cy.findByRole('heading', { name: /home/i }).should('exist');
      // assert first post doesnt exist
      cy.findByRole('heading', { name: RegExp(postTitle, 'i') }).should('not.exist');
    });
  });
});
