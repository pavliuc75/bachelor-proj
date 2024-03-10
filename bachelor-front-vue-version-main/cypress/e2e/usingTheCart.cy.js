//requirements: there should be kek@gmail.com already in the system
//requirements: should be at least one product in the system
//requirements: the user should not have any products in the cart

describe("FR-18 having access to cart", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8100/realms/Marketplace/protocol/openid-connect/auth?client_id=front-end&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%23%2Faccount&state=13ae0810-9bf5-4886-96c4-e73290234d3c&response_mode=fragment&response_type=code&scope=openid&nonce=d9332d07-b955-4238-82ae-11fe5d7f98af");

    cy.get("#username").click().type("kek@gmail.com");
    cy.get("#password").click().type("kek123{enter}");

    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
  });

  it("should be able to view the cart", function() {


    cy.get("[data-cy=\"cart-button\"]").click();

    cy.get("[data-cy=\"cart-page-header\"]").should("exist");
  });


  it("should add a product to the cart", function() {
    cy.get("[data-cy=\"base-button\"]").click();

    cy.get("[data-cy=\"product-card\"]").eq(0).click();
    cy.url().should("include", "product");

    cy.get("[data-cy=\"add-to-cart-button\"]").click();

    cy.wait(4000);

    cy.get("[data-cy=\"cart-button\"]").click();
    cy.url().should("include", "cart");
    cy.get("[data-cy=\"cart-item\"]").should("exist");
  });

  it("should remove item from cart", function() {
    cy.get("[data-cy=\"cart-button\"]").click();

    cy.get("[data-cy=\"cart-page-header\"]").should("exist");

    cy.get("[data-cy=\"remove-item-from-cart-button\"]").eq(0).click();

    cy.wait(4000);

    cy.get("[data-cy=\"cart-item\"]").should("not.exist");
  });
});