//requirements: there should be kek@gmail.com already in the system
//requirements: en language should be selected

import { getRandomString } from "../../src/util/stringGenerator.js";

let randomEmail = "cypress" + getRandomString(5) + "@gmail.com";

describe("FR-20 FR-09 FR-02 createAccount", () => {
  it("will not allow creating an account with an existing email", () => {
    cy.visit("http://localhost:8080/#/create-account");
    cy.get("input").eq(0).type("someFirstName");
    cy.get("input").eq(1).type("someLastName");
    cy.get("input").eq(2).type("kek1@gmail.com");
    cy.get("input").eq(3).type("test123");
    cy.get("[data-cy=\"create-account-button\"]").click();
    cy.contains("User with this email address exists").should("exist");
  });

  it("will create a new account", () => {
    cy.visit("http://localhost:8080/#/");

    cy.get("[data-cy=\"account-button\"]").click();
    cy.url().should("include", "realms");

    cy.contains("Create account").click();

    cy.visit("http://localhost:8080/#/create-account");
    cy.get("input").eq(0).type("someFirstName");
    cy.get("input").eq(1).type("someLastName");
    cy.get("input").eq(2).type(randomEmail);
    cy.get("input").eq(3).type("test123");
    cy.get("[data-cy=\"create-account-button\"]").click();
    cy.url().should("include", "realms");
  });

  it("will allow entering into the new account", () => {
    cy.visit("http://localhost:8080/#/");

    cy.get("[data-cy=\"account-button\"]").click();
    cy.url().should("include", "realms");

    cy.get("#username").click().type(randomEmail);
    cy.get("#password").click().type("test123{enter}");

    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.url().should("include", "/account");
  });
});
