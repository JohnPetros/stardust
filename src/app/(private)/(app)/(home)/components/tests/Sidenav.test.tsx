import { ToastProvider } from '@radix-ui/react-toast'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { Sidenav } from '../Sidenav'

import { usersMock } from '@/__tests__/mocks/usersMock'
import {
  AuthContext,
  AuthContextValue,
} from '@/contexts/AuthContext/hooks/useAuthContext'
import { SidebarContext, SidebarContextValue } from '@/contexts/SidebarContext'
import { SupabaseProvider } from '@/contexts/SupabaseContext'
import { HOME_LINKS } from '@/global/constants'

function renderSidenav(isExpanded: boolean = false) {
  const isAchievementsListVisibleMock = false

  const signOutMock = jest.fn()
  const setIsAchievementsListVisibleMock = jest.fn()
  const toggleSidenavMock = jest
    .fn()
    .mockImplementationOnce(() =>
      setIsAchievementsListVisibleMock(!isAchievementsListVisibleMock)
    )

  render(
    <SupabaseProvider>
      <TooltipProvider>
        <ToastProvider>
          <AuthContext.Provider
            value={
              {
                user: usersMock[0],
                signOut: signOutMock,
              } as unknown as AuthContextValue
            }
          >
            <SidebarContext.Provider
              value={
                {
                  isAchievementsListVisible: isAchievementsListVisibleMock,
                  setIsAchievementsListVisible:
                    setIsAchievementsListVisibleMock,
                } as unknown as SidebarContextValue
              }
            >
              <Sidenav
                isExpanded={isExpanded}
                toggleSidenav={toggleSidenavMock}
              />
            </SidebarContext.Provider>
          </AuthContext.Provider>
        </ToastProvider>
      </TooltipProvider>
    </SupabaseProvider>
  )

  return { toggleSidenavMock, signOutMock, setIsAchievementsListVisibleMock }
}

describe('Side nav component', () => {
  it('should toggle to true', async () => {
    const { toggleSidenavMock, setIsAchievementsListVisibleMock } =
      renderSidenav(false)

    const button = screen.getByLabelText(/Expandir barra de navegação lateral/i)

    fireEvent.click(button)

    expect(toggleSidenavMock).toHaveBeenCalled()
    expect(setIsAchievementsListVisibleMock).toHaveBeenCalledWith(true)
  })

  it('should show achievements list', async () => {
    const { setIsAchievementsListVisibleMock } = renderSidenav()

    const button = screen.getByText(/Conquistas/i)

    fireEvent.click(button)

    expect(setIsAchievementsListVisibleMock).toHaveBeenCalledWith(true)
  })

  it('should open sign out alert when user try to sign out', async () => {
    renderSidenav()

    const button = screen.getByText(/Sair/i)

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeVisible()
    })
  })

  it.each(HOME_LINKS)(
    'should render $label page link label when expanded',
    async ({ label }) => {
      renderSidenav(true)
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  )
})
