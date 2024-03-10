//requirement: kek2@gmail.com in system

describe("FR-14 viewing platform analytics", () => {
  it("will allow entering into administrator management tool and view analytics", () => {
    cy.visit("http://localhost:8080/#/");
    cy.get("[data-cy=\"account-button\"]").click();
    cy.url().should("include", "realms");

    cy.get("#username").click().type("kek2@gmail.com");
    cy.get("#password").click().type("kek123{enter}");
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.get("[data-cy=\"administrator-management-tool-button\"]").click();
    cy.url().should("include", "/administrator-management-tool");

    cy.get("[data-cy=\"stats-button\"]").click();

    cy.wait(60000);
    cy.get("[data-cy=\"analytics-table\"]").should("exist");
  });
});
