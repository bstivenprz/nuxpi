Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/sign-in');
    cy.get('[name=email]').type(email);
    cy.get('[name=password]').type(password);
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/');
  }, {
    validate() {
      cy.getCookies().length.should('be.greaterThan', 0);
    }
  })
})