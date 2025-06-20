import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/page";
import { AuthProvider } from "@/contexts/AuthContext";

// Mock useRouter from next/navigation
// Note: On frontend, we usually test components that use Next.js routing
// You can start testing page rendering one by one, then you validate the result with the title of the page.
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock the AuthProvider to avoid context issues
describe("Page", () => {
  it("renders a heading", () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    // Check the title of the page
    const title = screen.getByText("Login to your account");
    expect(title).toBeInTheDocument();
  });
});
