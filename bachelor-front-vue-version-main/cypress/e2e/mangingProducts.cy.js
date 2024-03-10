//requirements: there should be kek40@gmail.com already in the system
//requirements: user should have 1 product
//requirements: en language selected

import { getRandomString } from "../../src/util/stringGenerator.js";

let randomName = "cypress" + getRandomString(5);

describe("FR-03 managing products", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/#/");
    cy.get("[data-cy=\"account-button\"]").click();
    cy.url().should("include", "realms");

    cy.get("#username").click().type("kek40@gmail.com");
    cy.get("#password").click().type("kek123{enter}");
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.get("[data-cy=\"business-management-tool-button\"]").click();
    cy.url().should("include", "/business-management-tool");
  });

  it("should be able to update product", () => {
    cy.get("[data-cy=\"products-button\"]").click();
    cy.get("[data-cy=\"edit-product-button\"]").first().click();

    cy.get("[data-cy=\"product-name-input\"]").first().click({ force: true }).clear().type(randomName);

    cy.get("[data-cy=\"save-product-button\"]").first().click({ force: true });

    cy.contains(randomName).should("exist");
  });

  it("should be able to delete product", () => {
    cy.get("[data-cy=\"products-button\"]").click();
    cy.get("[data-cy=\"delete-product-button\"]").first().click();


    cy.contains("Confirm").click({ force: true });

    cy.wait(3000);

    cy.get("[data-cy=\"delete-product-button\"]").should("not.exist");
  });
});