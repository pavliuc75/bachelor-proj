//requirements: there should be kek@gmail.com already in the system
//requirements: en language should be selected

import { getRandomString } from "../../src/util/stringGenerator.js";

let randomEmail = "cypress" + getRandomString(5) + "@gmail.com";

describe("FR-20 FR-09 FR-02 login", () => {
  it("can login and go to account page", () => {
    cy.visit("http://localhost:8100/realms/Marketplace/protocol/openid-connect/auth?client_id=front-end&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%23%2Faccount&state=13ae0810-9bf5-4886-96c4-e73290234d3c&response_mode=fragment&response_type=code&scope=openid&nonce=d9332d07-b955-4238-82ae-11fe5d7f98af");

    cy.get("#username").click().type("kek1@gmail.com");
    cy.get("#password").click().type("kek123{enter}");

    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.url().should("include", "/account");
  });

  it("should not allow non existing user to login", () => {
    cy.visit("http://localhost:8100/realms/Marketplace/protocol/openid-connect/auth?client_id=front-end&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%23%2Faccount&state=13ae0810-9bf5-4886-96c4-e73290234d3c&response_mode=fragment&response_type=code&scope=openid&nonce=d9332d07-b955-4238-82ae-11fe5d7f98af");

    cy.get("#username").click().type(randomEmail);
    cy.get("#password").click().type("kek123{enter}");

    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.contains("Wrong email or password").should("exist");
  });

  it("should be possible to logout from the system", function() {
    cy.visit("http://localhost:8100/realms/Marketplace/protocol/openid-connect/auth?client_id=front-end&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%23%2Faccount&state=13ae0810-9bf5-4886-96c4-e73290234d3c&response_mode=fragment&response_type=code&scope=openid&nonce=d9332d07-b955-4238-82ae-11fe5d7f98af");

    cy.get("#username").click().type("kek1@gmail.com");
    cy.get("#password").click().type("kek123{enter}");

    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.url().should("include", "/account");

    cy.get("[data-cy=\"logout-button\"]").click();

    cy.visit("http://localhost:8080/#/account");

    cy.get("#username").should("exist");
  });
});