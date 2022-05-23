/// <reference types="cypress" />
//
// import { teardown } from 'test-server/test-client';
import { fakeUser } from 'test-client/server/fake-data';
import { Routes } from 'lib-client/constants';

const cookieName = Cypress.env('COOKIE_NAME');

describe('app', () => {
  // before first test
  // cookies and localStorage cleared afterEach test
  before(() => {
    cy.seedDb();
    cy.loginAsAdmin();
  });

  beforeEach(() => {
    // prevent clear after each test
    Cypress.Cookies.preserveOnce(cookieName);
  });

  after(async () => {
    // truncate db
    // await teardown();

    // clear after last test
    cy.clearCookies();
    cy.getCookies().should('be.empty');
  });

  it('search works', () => {
    // --------------
    // test search, logged out
    cy.visit('/');

    // wait for navbar to load
    // cy.findByText(/log in/i).should('exist');

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
    cy.findByText(/fetching/i).should('not.exist');

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
    // cy.findByText(/log in/i).should('exist');

    cy.findByRole('button', { name: /1/i }).should('have.class', 'button--primary');
    cy.findByRole('button', { name: /next/i }).click();
    cy.findByRole('button', { name: /2/i }).should('have.class', 'button--primary');
    cy.findByRole('button', { name: /prev/i }).click();
    cy.findByRole('button', { name: /1/i }).should('have.class', 'button--primary');
  });

  it('post item links', () => {
    // -----------
    // home page, must be logged in
    cy.visit('/');

    // select first post

    // profile links -----------

    // click avatar
    cy.get('.home__list .post-item:first-child .post-item__left a')
      .should('exist')
      .click();
    // assert profile page
    cy.url().should('include', `/${fakeUser.username}`);
    cy.findByRole('heading', { name: RegExp(fakeUser.name, 'i') }).should('exist');
    cy.go('back');

    // click name - desktop
    cy.get('.home__list .post-item:first-child .post-item__name')
      .first()
      .should('be.visible')
      .click();
    // assert profile page
    cy.url().should('include', `/${fakeUser.username}`);
    cy.findByRole('heading', { name: RegExp(fakeUser.name, 'i') }).should('exist');
    cy.go('back');

    // click username - desktop
    cy.get('.home__list .post-item:first-child .post-item__username')
      .first()
      .should('be.visible')
      .click();
    // assert profile page
    cy.url().should('include', `/${fakeUser.username}`);
    cy.findByRole('heading', { name: RegExp(fakeUser.name, 'i') }).should('exist');
    cy.go('back');

    // post links ----------

    // click title
    cy.get('.home__list .post-item:first-child h2').click();
    // assert post page
    cy.url().should('match', RegExp(`/${fakeUser.username}/post/\\d+`, 'i'));
    cy.get('h1').should('have.class', 'post__title');
    cy.go('back');

    // click time ago
    cy.get('.home__list .post-item:first-child .post-item__time')
      .first()
      .should('exist')
      .click();
    // assert post page
    cy.url().should('match', RegExp(`/${fakeUser.username}/post/\\d+`, 'i'));
    cy.get('h1').should('have.class', 'post__title');
    cy.go('back');

    // edit button
    cy.get('.post-item')
      .first()
      .within(() => {
        cy.findByText(/^edit$/i)
          .should('exist')
          .click();
      });
    // assert create/edit post page
    cy.url().should('match', /\/post\/create\/\d+/i);
    cy.findByRole('heading', { name: /edit post/i }).should('exist');
    // todo: assert title input value
    cy.go('back');

    // delete button
    cy.intercept('DELETE', `${Routes.API.POSTS}*`).as('deletePost');
    cy.get('.post-item')
      .first()
      .within(() => {
        cy.get('h2')
          .invoke('text')
          .then((title) => {
            // post exists
            cy.findByRole('heading', { name: RegExp(title, 'i') }).should('exist');
            cy.findByRole('button', { name: /delete/i }).click();
            cy.wait('@deletePost');
            // post doesnt exist
            cy.findByRole('heading', { name: RegExp(title, 'i') }).should('not.exist');
          });
      });
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
    it('post page, edit post', function () {
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

    it('post page, delete post', function () {
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
  // home: edit btn, delete btn, navbar links, post link, user link
  // post: edit, delete
  // profile: render
  // settings, create
  // register
  // log out
});
