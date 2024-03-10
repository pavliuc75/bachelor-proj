//requirements: there should be kek10@gmail.com already in the system

describe("FR-06 viewing business analytics", () => {
  it("will allow entering into business management tool and view analytics", () => {
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
    cy.get("[data-cy=\"analytics-table\"]").should("exist");
  });
});