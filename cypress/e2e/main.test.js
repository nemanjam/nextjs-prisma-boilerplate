/// <reference types="cypress" />
import { teardown } from 'test-server/test-client';
import { fakeUser } from 'test-client/server/fake-data';

describe('app', () => {
  beforeAll(() => {
    // seed
    cy.visit('/');
    cy.getByRole('link', {
      name: /reseed/i,
    }).click();
  });

  afterAll(async () => {
    // truncate db
    await teardown();
  });

  beforeEach(() => {
    cy.visit('/');
  });

  fakeUser.name = 'cypress0 user';
  fakeUser.username = 'cypress0';
  fakeUser.email = 'cypress0@email.com';
  const password = '123456';

  test('entire app flow', () => {
    // go to register page
    cy.getByText(/register/i).click();
    // assert register page
    cy.url().should('equal', '/auth/register/');
    cy.getByRole('heading', {
      name: /register/i,
    }).should('be.visible');

    // create user
    cy.getByRole('textbox', {
      name: /name/i,
    }).type(fakeUser.name);
    cy.getByRole('textbox', {
      name: /username/i,
    }).type(fakeUser.username);
    cy.getByRole('textbox', {
      name: /email/i,
    }).type(fakeUser.email);
    cy.findByLabelText('textbox', {
      name: /password/i,
    }).type(password);
    cy.findByLabelText('textbox', {
      name: /confirmPassword/i,
    }).type(password);
    cy.getByRole('button', {
      name: /register/i,
    }).click();
  });
});
