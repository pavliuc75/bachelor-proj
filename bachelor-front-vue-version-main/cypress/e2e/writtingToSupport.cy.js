//requirement: having kek1@gmail.com in the system
//requirement: no support chat started

describe("FR-21 contact platform administrator", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8100/realms/Marketplace/protocol/openid-connect/auth?client_id=front-end&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%23%2Faccount&state=13ae0810-9bf5-4886-96c4-e73290234d3c&response_mode=fragment&response_type=code&scope=openid&nonce=d9332d07-b955-4238-82ae-11fe5d7f98af");

    cy.get("#username").click().type("kek1@gmail.com");
    cy.get("#password").click().type("kek123{enter}");

    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.url().should("include", "/account");
  });

  it("will allow creating a new support chat", () => {
    cy.get("[data-cy=\"contact-administrator-button\"]").click();

    cy.get("[data-cy=\"question-textarea\"]").first().click({force: true}).type("Hello, I have a question");

    cy.get("[data-test=\"footer\"]").children().eq(1).click({force: true});

    cy.wait(4000);

    cy.contains("Hello, I have a question").should("exist");
  });

  it("will allow writing to support chat", () => {
    cy.get("[data-cy=\"contact-administrator-button\"]").click();

    cy.get("[data-cy=\"new-message-textarea\"]").first().click({ force: true }).type("some_message");
    cy.get("[data-cy=\"send-message-button\"]").click({ force: true });

    cy.wait(3000);

    cy.contains("some_message").should("exist");
  });

  it("will allow closing the support chat", () => {
    cy.get("[data-cy=\"contact-administrator-button\"]").click();


    cy.get("[data-cy=\"close-issue-button\"]").click({ force: true });

    cy.get("[data-test=\"footer\"]").children().eq(1).click({ force: true });

    cy.wait(3000);

    cy.get("[data-cy=\"contact-administrator-button\"]").click();
    cy.get("[data-cy=\"question-textarea\"]").should("exist");

  });
});