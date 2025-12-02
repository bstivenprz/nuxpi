/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

describe('Formulario de registro', () => {
  it('Registrar un nuevo usuario', () => {
    cy.visit("/sign-up")
    cy.get("[name=email]").type(faker.internet.email())
    cy.get("[name=password]").type("Test123*")
    cy.get("[name=name]").type(faker.person.fullName())
    cy.get("[name=username]").type(faker.internet.username())
    cy.get("button[type=submit]").click()
  })
})