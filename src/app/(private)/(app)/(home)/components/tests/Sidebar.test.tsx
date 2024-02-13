import { render, screen } from '@testing-library/react'

import { Sidebar } from '../Sidebar'

import { usersMock } from '@/__tests__/mocks/core/usersMock'
import {
  AuthContext,
  AuthContextValue,
} from '@/contexts/AuthContext/hooks/useAuthContext'
import { SidebarContext, SidebarContextValue } from '@/contexts/SidebarContext'

const userMock = usersMock[0]

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
