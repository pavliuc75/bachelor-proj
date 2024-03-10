//requirements: there should be kek@gmail.com already in the system
//requirements: en language should be selected
//requirements: should be at least one product in the system
//requirements: the user should not have any products in favorites
//requirements: the user should not have any products in cart

describe("FR-23 interacting with favorite items", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8100/realms/Marketplace/protocol/openid-connect/auth?client_id=front-end&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%23%2Faccount&state=13ae0810-9bf5-4886-96c4-e73290234d3c&response_mode=fragment&response_type=code&scope=openid&nonce=d9332d07-b955-4238-82ae-11fe5d7f98af");

    cy.get("#username").click().type("kek@gmail.com");
    cy.get("#password").click().type("kek123{enter}");

    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
  });

  it("should be able to view favorite items", function() {
    cy.get("[data-cy=\"favorites-button\"]").click();
    cy.get("[data-cy=\"favorites-page-header\"]").should("exist");
  });

  it("should add a product to favorites", function() {
    cy.get("[data-cy=\"base-button\"]").click();

    cy.get("[data-cy=\"product-card\"]").eq(0).click();
    cy.url().should("include", "product");

    cy.get("[data-cy=\"add-to-favorites-button\"]").click();

    cy.wait(4000);

    cy.get("[data-cy=\"favorites-button\"]").click();
    cy.url().should("include", "favorites");
    cy.get("[data-cy=\"favorite-item\"]").should("exist");
  });

  it("should remove item from favorites", function() {
    cy.get("[data-cy=\"favorites-button\"]").click();

    cy.get("[data-cy=\"favorites-page-header\"]").should("exist");

    cy.get("[data-cy=\"remove-item-from-favorites-button\"]").eq(0).click();

    cy.wait(4000);

    cy.get("[data-cy=\"favorite-item\"]").should("not.exist");
  });

  it("should move item from favorites to cart", function() {
    cy.get("[data-cy=\"base-button\"]").click();
    cy.get("[data-cy=\"product-card\"]").eq(0).click();
    cy.get("[data-cy=\"add-to-favorites-button\"]").click();
    cy.wait(4000);

    cy.get("[data-cy=\"favorites-button\"]").click();
    cy.url().should("include", "favorites");
    cy.get("[data-cy=\"favorite-item\"]").should("exist");

    cy.get("[data-cy=\"move-item-to-cart-button\"]").eq(0).click();

    cy.wait(4000);
    cy.get("[data-cy=\"favorite-item\"]").should("not.exist");

    cy.get("[data-cy=\"cart-button\"]").click();
    cy.get("[data-cy=\"cart-item\"]").should("exist");
  });
});