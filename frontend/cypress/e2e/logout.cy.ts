describe("SOCS Logout Workflow", () => {
  beforeEach(() => {
    // Step 1: Login first
    cy.visit("http://localhost:3000/");
    cy.get('input[name="email"]').type("dizourazipa-5793@yopmail.com");
    cy.get('input[name="password"]').type("test123456");
    cy.get('button[type="submit"]').click();

    // Step 2: Verify dashboard loaded
    cy.url().should("include", "/dashboard");
    cy.contains("Home").should("be.visible");
  });

  it("logs out successfully and redirects to login page", () => {
    // Step 3: Click the user menu to open it and select Trigger logout (adjust selector for your logout button)
    // Delay to ensure the user menu is fully loaded
    cy.wait(2000);

    cy.get('[data-testid="user-menu"]').click();
    cy.get('button[data-testid="logout-button"]').click();

    // Step 4: Validate redirect to login page
    cy.url().should("eq", "http://localhost:3000/");
  });
});
