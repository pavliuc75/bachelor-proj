describe("FR- 17 searching products", () => {
  it("should be able to use the search bar from navigation to got search page", function() {
    cy.visit("http://localhost:8080/#/");
    cy.get("[data-cy=\"search-input\"]").first().click().type("*{enter}");
    cy.url().should("include", "search");
  });

  it("should be able select different categories for search", function() {
    cy.visit("http://localhost:8080/#/search?keyword=%2a");
    cy.url().should("include", "search");

    cy.get("[data-cy=\"category-filter-menu\"]").click({ force: true });
    cy.get("[data-cy=\"menu-item\"]").first().click();

    cy.get("[data-cy=\"remove-category-filter-button\"]").should("exist");
    cy.url().should("include", "categories");
  });

  it("should be able remove selected category", function() {
    cy.visit("http://localhost:8080/#/search?keyword=%2a");
    cy.url().should("include", "search");

    cy.get("[data-cy=\"category-filter-menu\"]").click({ force: true });
    cy.get("[data-cy=\"menu-item\"]").first().click();

    cy.get("[data-cy=\"remove-category-filter-button\"]").click();
    cy.url().should("not.include", "categories");
  });

  it("should be able search for items that are not in stock", function() {
    cy.visit("http://localhost:8080/#/search?keyword=%2a");
    cy.url().should("include", "search");

    cy.get("[data-cy=\"stock-filter-menu\"]").click({ force: true });
    cy.get("[data-cy=\"menu-item\"]").eq(1).click();

    cy.get("[data-cy=\"remove-out-of-stock-button\"]").click();
    cy.url().should("not.include", "inStock=false");
  });
});