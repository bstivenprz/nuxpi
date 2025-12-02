import { faker } from "@faker-js/faker"

describe('Formulario actualización de perfil', () => {
  it('Actualizar el nombre público', () => {
    cy.visit("/account/profile")
    cy.get("[name=name]").type(faker.person.fullName())
    cy.get("button[type=submit]").click()
  })

  it('Actualizar la presentación', () => {
    cy.visit("/account/profile")
    cy.get("[name=presentation]").type(faker.lorem.text())
    cy.get("button[type=submit]").click()
  })
})