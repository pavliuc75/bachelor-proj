//requirements: there should be kek10@gmail.com already in the system
//requirements: en language selected

import { getRandomString } from "../../src/util/stringGenerator.js";

let randomCategory = "cypress" + getRandomString(5);

describe("FR-04 managing product categories", () => {
  it("will allow requesting adding a new category", () => {
    cy.visit("http://localhost:8080/#/");
    cy.get("[data-cy=\"account-button\"]").click();
    cy.url().should("include", "realms");

    cy.get("#username").click().type("kek10@gmail.com");
    cy.get("#password").click().type("kek123{enter}");
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.get("[data-cy=\"business-management-tool-button\"]").click();
    cy.url().should("include", "/business-management-tool");

    cy.get("[data-cy=\"other-button\"]").click();

    cy.wait(5000);

    cy.get("[data-cy=\"request-category-button\"]").click();
    cy.get("[data-cy=\"request-category-input\"]").click({ force: true }).type(randomCategory + "{enter}");

    cy.contains("Request has been sent").should("exist");
  });
});