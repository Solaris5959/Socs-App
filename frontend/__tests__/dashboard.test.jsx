// page.test.tsx
import { render, screen } from '@testing-library/react'
import Page from '@/app/dashboard/page'

// Mock the FeedComponent
jest.mock('@/components/FeedComponent', () => () => {
  return <div data-testid="feed-component">Mock Feed</div>
})

describe('Home Page', () => {
  it('renders FeedComponent', () => {
    render(<Page />)
    const feed = screen.getByTestId('feed-component')
    expect(feed).toBeInTheDocument()
  })
})
