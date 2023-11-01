import { render, screen } from '@testing-library/react'

import { Sidebar } from '../Sidebar'

import { userMock } from '@/__tests__/mocks/userMock'
import { AuthContext, AuthContextValue } from '@/contexts/AuthContext'
import { SidebarContext, SidebarContextValue } from '@/contexts/SidebarContext'

function renderSidebar(isOpen: boolean) {
  render(
    <AuthContext.Provider
      value={{ user: userMock } as unknown as AuthContextValue}
    >
      <SidebarContext.Provider
        value={{ isOpen } as unknown as SidebarContextValue}
      >
        <Sidebar />
      </SidebarContext.Provider>
    </AuthContext.Provider>
  )
}

describe('Sidebar component', () => {
  it('should render user data when is open', () => {
    renderSidebar(true)

    expect(screen.getByText(userMock.name)).toBeVisible()
    expect(screen.getByText(userMock.email)).toBeVisible()
  })
})