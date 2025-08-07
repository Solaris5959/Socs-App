import { render, screen } from '@testing-library/react';
import Page from '@/app/dashboard/favorites/page';

// Mock the MyFavorites component
jest.mock('@/components/MyFavorites', () => () => (
  <div data-testid="my-favorites">Mock MyFavorites</div>
));

describe('Favorites Page', () => {
  it('renders MyFavorites component', () => {
    render(<Page />);
    expect(screen.getByTestId('my-favorites')).toBeInTheDocument();
  });
});
