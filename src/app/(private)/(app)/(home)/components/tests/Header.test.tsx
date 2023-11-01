import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { Header } from '../Header'

import { userMock } from '@/__tests__/mocks/usersMock'
import { AuthContext, AuthContextValue } from '@/contexts/AuthContext'
import { SidebarContext, SidebarContextValue } from '@/contexts/SidebarContext'
import { SupabaseProvider } from '@/contexts/SupabaseContext'

function renderComponent() {
  const toggleMock = jest.fn()

  render(
    <SupabaseProvider>
      <AuthContext.Provider
        value={{ user: userMock } as unknown as AuthContextValue}
      >
        <SidebarContext.Provider
          value={{ toggle: toggleMock } as unknown as SidebarContextValue}
        >
          <Header />
        </SidebarContext.Provider>
      </AuthContext.Provider>
    </SupabaseProvider>
  )

  return { toggleMock }
}

describe('Home Header component', () => {
  it('should render user data', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText(userMock.coins)).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText(userMock.streak)).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText(userMock.name)).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText(userMock.email)).toBeInTheDocument()
    })
  })

  it('should toggle Sidebar', async () => {
    const { toggleMock } = renderComponent()

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(toggleMock).toHaveBeenCalled()
    })
  })
})
