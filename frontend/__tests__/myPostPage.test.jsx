import { render, screen } from '@testing-library/react';
import Page from '@/app/dashboard/myposts/page';

// Mock the MyPosts component
jest.mock('@/components/MyPosts', () => () => (
  <div data-testid="my-posts">Mock MyPosts</div>
));

describe('MyPosts Page', () => {
  it('renders MyPosts component', () => {
    render(<Page />);
    expect(screen.getByTestId('my-posts')).toBeInTheDocument();
  });
});
