/// <reference types="cypress" />
//
import { teardown } from 'test-server/test-client';
import { fakeUser } from 'test-client/server/fake-data';

describe('app', () => {
  before(() => {
    // seed
    cy.visit('/');
    cy.findByRole('link', {
      name: /reseed/i,
    }).click();
  });

  after(async () => {
    // truncate db
    await teardown();
  });

  beforeEach(() => {
    cy.visit('/');
  });

  // const fakeUser = {} as any;
  fakeUser.name = 'cypress0 user';
  fakeUser.username = 'cypress0';
  fakeUser.email = 'cypress0@email.com';
  const password = '123456';

  it('entire app flow', () => {
    // go to register page
    cy.findByText(/register/i).click();
    // assert register page
    cy.url().should('include', '/auth/register/');
    cy.findByRole('heading', {
      name: /register/i,
    }).should('be.visible');

    // create user
    cy.findByRole('textbox', {
      name: /^name$/i,
    }).type(fakeUser.name);
    cy.findByRole('textbox', {
      name: /username/i,
    }).type(fakeUser.username);
    cy.findByRole('textbox', {
      name: /email/i,
    }).type(fakeUser.email);
    cy.findByLabelText(/^password$/i).type(password);
    cy.findByLabelText(/confirmPassword/i).type(password);

    // submit form
    cy.findByRole('button', {
      name: /register/i,
    }).click();
  });
});
