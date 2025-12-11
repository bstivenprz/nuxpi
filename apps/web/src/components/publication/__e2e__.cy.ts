import { faker } from '@faker-js/faker';

describe('Publicación', () => {
  it('Crear comentario', () => {
    const comment = faker.lorem.sentence({ min: 1, max: 100 });
    cy.get('textarea').type(comment);
    cy.get('button[type=submit]').click();
    cy.get('p').should('contain', comment);
  })
})