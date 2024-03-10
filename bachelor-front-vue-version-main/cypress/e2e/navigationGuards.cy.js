//requirements: there should be kek10@gmail.com already in the system
//requirements: en language should be selected
//requirements: should be at least one product in the system

describe("no authenticated user", () => {
  it("should be able to go any product page without login", function() {
    cy.visit("http://localhost:8080/#/");
    cy.get("[data-cy=\"product-card\"]").eq(0).click();
    cy.url().should("include", "product");
  });

  it("should not be able to go to account page when not logged in", function() {
    cy.visit("http://localhost:8080/#/account");
    cy.url().should("include", "realms");
  });
});

describe("authenticated user", () => {
  it("should be able to orders page when logged in", function() {
    cy.visit("http://localhost:8100/realms/Marketplace/protocol/openid-connect/auth?client_id=front-end&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%23%2Faccount&state=13ae0810-9bf5-4886-96c4-e73290234d3c&response_mode=fragment&response_type=code&scope=openid&nonce=d9332d07-b955-4238-82ae-11fe5d7f98af");

    cy.get("#username").click().type("kek10@gmail.com");
    cy.get("#password").click().type("kek123{enter}");

    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.get("[data-cy=\"orders-button\"]").click();

    cy.url().should("include", "orders");
  });

  it("should be able to go to administrator management tool", function() {
    cy.visit("http://localhost:8100/realms/Marketplace/protocol/openid-connect/auth?client_id=front-end&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%23%2Faccount&state=13ae0810-9bf5-4886-96c4-e73290234d3c&response_mode=fragment&response_type=code&scope=openid&nonce=d9332d07-b955-4238-82ae-11fe5d7f98af");

    cy.get("#username").click().type("kek10@gmail.com");
    cy.get("#password").click().type("kek123{enter}");

    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.visit("http://localhost:8080/#/administrator-management-tool");
    cy.url().should("include", "page-not-found");
  });

});
