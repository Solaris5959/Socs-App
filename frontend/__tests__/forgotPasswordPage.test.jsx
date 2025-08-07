import { render, screen } from '@testing-library/react';
import Page from '@/app/forgot-password/page';

jest.mock('@/components/ForgotPasswordForm', () => ({
  ForgotPasswordForm: () => <div data-testid="forgot-password-form">Mock ForgotPasswordForm</div>,
}));

jest.mock('@/components/Footer', () => () => (
  <div data-testid="footer">Mock Footer</div>
));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} alt={props.alt || 'image'} />;
  },
}));

describe('Forgot Password Page', () => {
  it('renders ForgotPasswordForm and Footer', () => {
    render(<Page />);

    expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByAltText(/co-working space/i)).toBeInTheDocument(); // background image
  });
});
