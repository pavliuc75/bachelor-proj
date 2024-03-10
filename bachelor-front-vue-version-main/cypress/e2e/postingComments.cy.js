//requirement: kek1@gmail.com in system

import { getRandomString } from "../../src/util/stringGenerator.js";

let randomString = "cypress_comment_" + getRandomString(5);

describe("FR-26, FR-07 adding comments", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8100/realms/Marketplace/protocol/openid-connect/auth?client_id=front-end&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%23%2Faccount&state=13ae0810-9bf5-4886-96c4-e73290234d3c&response_mode=fragment&response_type=code&scope=openid&nonce=d9332d07-b955-4238-82ae-11fe5d7f98af");

    cy.get("#username").click().type("kek1@gmail.com");
    cy.get("#password").click().type("kek123{enter}");

    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.url().should("include", "/account");
  });


  it("will allow adding a comment", () => {
    cy.get("[data-cy=\"base-button\"]").click();

    cy.get("[data-cy=\"product-card\"]").eq(0).click();
    cy.url().should("include", "product");

    cy.get("[data-cy=\"open-product-side-bar-button\"]").click();



    cy.get("[data-cy=\"write-a-comment-button\"]").click();

    cy.get("[data-cy=\"comment-textarea\"]").first().click().type(randomString);
    cy.get("[data-cy=\"post-comment-button\"]").click();

    cy.wait(3000);

    cy.contains(randomString).should("exist");
  });
});
