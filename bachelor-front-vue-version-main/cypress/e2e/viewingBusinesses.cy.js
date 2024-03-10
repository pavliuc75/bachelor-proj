//requirements: should be at least one business in the system
describe("FR-16 viewing businesses and business overview", () => {
  it("should be able view list of businesses", function() {
    cy.visit("http://localhost:8080/#/");
    cy.get("[data-cy=\"nav-side-bar-button\"]").click();
    cy.get("[data-cy=\"business-pages-button\"]").click();

    cy.url().should("include", "business-pages");

    cy.get("[data-cy=\"companies-header\"]").should("exist");
  });

  it("should be able view business information", function() {

    cy.visit("http://localhost:8080/#/business-pages");
    cy.get("[data-cy=\"business-page-button\"]").eq(0).click();

    cy.url().should("include", "business-page");
    cy.get("[data-cy=\"company-header\"]").should("exist");
  });
});