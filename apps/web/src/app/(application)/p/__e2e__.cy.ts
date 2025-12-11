import { faker } from "@faker-js/faker";

describe("Publicación", () => {
  it("Crear publicación de texto", () => {
    const caption = faker.lorem.sentence();

    cy.visit("/create");
    cy.get("[name=caption]").type(caption);
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/p/");

    cy.get("p").should("contain", caption);
  });
});
