import { render, screen } from '@testing-library/react';
import Page from '@/app/dashboard/workspace/page';

// Mock the WorkSpaceComponent
jest.mock('@/components/WorkSpaceComponent', () => () => (
  <div data-testid="workspace-component">Mock Workspace</div>
));

describe('Workspace Page', () => {
  it('renders WorkSpaceComponent', () => {
    render(<Page />);
    expect(screen.getByTestId('workspace-component')).toBeInTheDocument();
  });
});
