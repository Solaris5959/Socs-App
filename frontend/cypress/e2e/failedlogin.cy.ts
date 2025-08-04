describe("SOCS Failed Login Workflow", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/"); // Login page is home
    cy.get('input[name="email"]').should("be.visible");
  });

  it("displays error message for invalid credentials", () => {
    cy.get('input[name="email"]').type("wronguser");
    cy.get('input[name="password"]').type("wrongpass");
    cy.get('button[type="submit"]').click();

    // Assertion: Error message visible
    cy.contains("Invalid email format").should("be.visible");

    // Assertion: URL should still be login page
    cy.url().should("eq", "http://localhost:3000/");
  });
});
