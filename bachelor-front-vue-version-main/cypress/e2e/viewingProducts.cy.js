//requirements: should be at least one product in the system

describe("FR-17 viewing products", () => {
  it("should be able to view a product", function() {
    cy.visit("http://localhost:8080/#/");
    cy.get("[data-cy=\"product-card\"]").eq(0).click();
    cy.url().should("include", "product");
  });

  it("should be able to add filtering options for products", function() {
    cy.visit("http://localhost:8080/#/");

    cy.get("[data-cy=\"category-filter-menu\"]").click({ force: true });
    cy.get("[data-cy=\"menu-item\"]").first().click();

    cy.get("[data-cy=\"remove-category-filter-button\"]").should("exist");
    cy.url().should("include", "categories");
  });

  it("should be able to remove filtering options for products", function() {
    cy.visit("http://localhost:8080/#/");
    cy.get("[data-cy=\"category-filter-menu\"]").click({ force: true });
    cy.get("[data-cy=\"menu-item\"]").first().click();

    cy.get("[data-cy=\"remove-category-filter-button\"]").click();
    cy.url().should("not.include", "categories");
  });

  it("should be able to view products out of stock", function() {
    cy.visit("http://localhost:8080/#/");

    cy.get("[data-cy=\"stock-filter-menu\"]").click({ force: true });
    cy.get("[data-cy=\"menu-item\"]").eq(1).click();

    cy.get("[data-cy=\"remove-out-of-stock-button\"]").click();
    cy.url().should("not.include", "inStock=false");
  });
});