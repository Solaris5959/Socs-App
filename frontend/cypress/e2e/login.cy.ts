describe("SOCS Login Workflow", () => {
  // visit the login page before each test
  beforeEach(() => {
    cy.visit("http://localhost:3000/"); // Your Next.js login page
  });

  it("logs in successfully with valid credentials", () => {
    cy.get('input[name="email"]').type("dizourazipa-5793@yopmail.com");
    cy.get('input[name="password"]').type("test123456");

    cy.get('button[type="submit"]').click();

    // Your dashboard route
    cy.url().should("include", "/dashboard");
    cy.contains("Home").should("be.visible");
  });
});
