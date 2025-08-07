import { render, screen } from '@testing-library/react';
import Page from '@/app/reset-password/page';

// Mock ResetPasswordForm
jest.mock('@/components/ResetPasswordForm', () => ({
  ResetPasswordForm: () => <div data-testid="reset-password-form">Mock ResetPasswordForm</div>,
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

describe('Reset Password Page', () => {
  it('renders ResetPasswordForm and Footer', () => {
    render(<Page />);

    expect(screen.getByTestId('reset-password-form')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByAltText(/co-working space/i)).toBeInTheDocument(); // background image
  });
});
