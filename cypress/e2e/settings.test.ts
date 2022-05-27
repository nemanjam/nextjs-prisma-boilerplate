/// <reference types="cypress" />
//
import { fakeUser } from 'test-client/server/fake-data';
import { Routes } from 'lib-client/constants';
import { clear } from 'console';

const cookieName = Cypress.env('COOKIE_NAME');

describe('Settings page', () => {
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

  it('name, username and images are loaded', () => {
    // settings for logged in user
    cy.visit(Routes.SITE.SETTINGS);

    // assert title
    cy.findByRole('heading', { name: /settings/i }).should('exist');

    // username
    cy.findByRole('textbox', { name: /^username$/i }).should(
      'have.value',
      fakeUser.username
    );

    // name
    cy.findByRole('textbox', { name: /^name$/i }).should('have.value', fakeUser.name);

    // header
    cy.get('.settings__form-field--header img')
      .should('be.visible')
      .and(($img) => {
        expect(($img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
      });

    // avatar
    cy.get('.settings__form-field--avatar img')
      .should('be.visible')
      .and(($img) => {
        expect(($img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
      });
  });

  it.only('update name and check it on profile page', () => {
    cy.visit(Routes.SITE.SETTINGS);
    const updatedName = `Updated: ${fakeUser.name}`;

    // assert title
    cy.findByRole('heading', { name: /settings/i }).should('exist');

    // wait for images in form to load
    cy.get('.settings__form-field--header img')
      .should('be.visible')
      .and(($img) => {
        expect(($img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
      });

    // edit name, clear
    cy.findByRole('textbox', { name: /^name$/i })
      .should('have.value', fakeUser.name)
      .focus()
      .clear();

    // type
    cy.findByRole('textbox', { name: /^name$/i })
      .should('have.value', '')
      .type(updatedName);

    cy.intercept('PATCH', `${Routes.API.USERS}*`).as('patchUser');

    // click submit
    cy.findByRole('button', { name: /submit/i }).click();

    // wait http
    cy.wait('@patchUser');

    // assert new name
    cy.findByRole('textbox', { name: /^name$/i }).should('have.value', updatedName);

    // go to profile page
    cy.findByText(/^profile$/i).click();

    // assert new name
    cy.findByRole('heading', { name: RegExp(updatedName, 'i') }).should('exist');
  });
});
