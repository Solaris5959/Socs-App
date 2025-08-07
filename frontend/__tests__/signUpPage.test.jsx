import { render, screen } from '@testing-library/react';
import Page from '@/app/signup/page';

// Mock SignUpForm
jest.mock('@/components/SignUpForm', () => ({
  SignUpForm: () => <div data-testid="signup-form">Mock SignUpForm</div>,
}));

// Mock Footer
jest.mock('@/components/Footer', () => () => (
  <div data-testid="footer">Mock Footer</div>
));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} alt={props.alt || 'image'} />;
  },
}));

describe('Sign Up Page', () => {
  it('renders SignUpForm and Footer', () => {
    render(<Page />);

    expect(screen.getByTestId('signup-form')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByAltText(/co-working space/i)).toBeInTheDocument(); // background image
  });
});
