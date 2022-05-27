/// <reference types="cypress" />
//
import { fakeUser } from 'test-client/server/fake-data';

describe('Profile page', () => {
  before(() => {
    cy.task('db:seed');
  });

  after(() => {
    cy.task('db:teardown');
  });

  // doesnt need logged in user
  it('in profile card, info and images are loaded', () => {
    cy.visit(`/${fakeUser.username}`);

    // select user card only
    cy.get('.profile__user-card')
      .first()
      .within(() => {
        // header
        cy.get('.profile__header-image img')
          // .first()
          .filter(':visible')
          .should('be.visible')
          .and(($img) => {
            // doesnt work
            expect(($img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
          });

        // avatar
        cy.get('.profile__avatar-wrapper img')
          .eq(1) // second
          .filter(':visible')
          .should('be.visible')
          .and(($img) => {
            expect(($img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
          });

        // name
        cy.findByRole('heading', { name: RegExp(fakeUser.name, 'i') }).should('exist');

        // username
        cy.findByText(RegExp(`@${fakeUser.username}`, 'i')).should('exist');
      });
  });
});
