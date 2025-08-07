import { render, screen } from '@testing-library/react';
import Page from '@/app/dashboard/support/page';

describe('User Support Page', () => {
  it('renders support message', () => {
    render(<Page />);
    expect(screen.getByText('User Support goes here...')).toBeInTheDocument();
  });
});
