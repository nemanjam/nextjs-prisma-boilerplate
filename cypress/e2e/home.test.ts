/// <reference types="cypress" />
//
import { fakeUser } from 'test-client/server/fake-data';
import { Routes } from 'lib-client/constants';

const cookieName = Cypress.env('COOKIE_NAME');

describe('Home page', () => {
  // before first test
  // cookies and localStorage cleared afterEach test by default
  before(() => {
    cy.clearCookies();
    cy.getCookies().should('be.empty');

    // cy.seedDbViaUI();
    cy.task('db:seed');
    cy.loginAsAdmin();
  });

  beforeEach(() => {
    // prevent clear after each test
    Cypress.Cookies.preserveOnce(cookieName);
  });

  after(async () => {
    cy.task('db:teardown');
    // can not and no need to clear cookies here
  });

  it('search form filters posts by user', () => {
    // either logged in or logged out
    cy.visit('/');

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

  it('pagination next and previous works', () => {
    // either logged in or logged out
    cy.visit('/');

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

  // home: edit btn, delete btn, post link, user link, done
  // post: edit, delete, done
  // navbar links
  // log out
  // ------------
  // profile: render
  // settings, create
  // register
  // seed ui test
});
