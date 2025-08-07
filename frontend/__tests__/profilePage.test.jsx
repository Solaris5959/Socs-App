import { render, screen } from '@testing-library/react';
import Page from '@/app/dashboard/profile/page';

// Mock the UserProfile component
jest.mock('@/components/UserProfile', () => ({
  UserProfile: () => <div data-testid="user-profile">Mock UserProfile</div>,
}));

describe('User Profile Page', () => {
  it('renders UserProfile component', () => {
    render(<Page />);
    expect(screen.getByTestId('user-profile')).toBeInTheDocument();
  });
});
