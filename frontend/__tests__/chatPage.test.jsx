import { render, screen } from '@testing-library/react'
import Page from '@/app/dashboard/chats/[chatId]/page'

// Mock ChatComponent
jest.mock('@/components/ChatComponent', () => () => (
  <div data-testid="chat-component">Mock Chat</div>
))

describe('Chat Page', () => {
  it('renders ChatComponent', () => {
    render(<Page />)
    expect(screen.getByTestId('chat-component')).toBeInTheDocument()
  })
})
