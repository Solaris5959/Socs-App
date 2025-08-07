import { render, screen } from '@testing-library/react';
import Page from '@/app/dashboard/connections/page';

// Mock the ConnectionComponent
jest.mock('@/components/ConnectionComponent', () => () => (
  <div data-testid="connection-component">Mock Connection</div>
));

describe('Connections Page', () => {
  it('renders ConnectionComponent', () => {
    render(<Page />);
    expect(screen.getByTestId('connection-component')).toBeInTheDocument();
  });
});
