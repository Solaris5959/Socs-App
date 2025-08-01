describe("SOCS Post Workflow", () => {
  beforeEach(() => {
    // Step 1: Login
    cy.visit("http://localhost:3000/"); // Home is login page
    cy.get('input[name="email"]').type("dizourazipa-5793@yopmail.com");
    cy.get('input[name="password"]').type("test123456");
    cy.get('button[type="submit"]').click();

    // Step 2: Navigate to dashboard (auto-redirect after login)
    cy.url().should("include", "/dashboard");
    cy.contains("Home").should("be.visible");
  });

  it("creates a new post successfully", () => {
    // Step 3: Open the post creation field
    cy.get('textarea[name="post-content"]').type(
      "Hello SOCS! This is my first automated post."
    );

    // Step 4: Click the submit button
    cy.get('button[type="submit"]').contains("Post").click();

    // Step 5: Verify the post appears in the feed
    cy.contains("Hello SOCS! This is my first automated post.").should(
      "be.visible"
    );
  });
});
