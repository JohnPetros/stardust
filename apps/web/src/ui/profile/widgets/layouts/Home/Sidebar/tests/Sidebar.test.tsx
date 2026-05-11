import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ROUTES } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useSiderbarContext } from '@/ui/profile/contexts/SidebarContext'
import { Sidebar } from '..'

jest.mock('@/ui/auth/contexts/AuthContext', () => ({
  useAuthContext: jest.fn(),
}))

jest.mock('@/ui/global/hooks/useNavigationProvider', () => ({
  useNavigationProvider: jest.fn(),
}))

jest.mock('@/ui/profile/contexts/SidebarContext', () => ({
  useSiderbarContext: jest.fn(),
}))

jest.mock('@/ui/global/widgets/components/UserAvatar', () => ({
  UserAvatar: () => <div data-testid='user-avatar' />,
}))

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: () => <span data-testid='icon' />,
}))

jest.mock('@/ui/global/widgets/components/SignOutAlertDialog', () => ({
  SignOutAlertDialog: ({ children }: any) => <>{children}</>,
}))

jest.mock('@/ui/profile/widgets/layouts/Home/Sidebar/AnimatedBar', () => ({
  AnimatedBar: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/ui/profile/widgets/layouts/Home/AchievementsList', () => ({
  AchievementsList: () => <div data-testid='achievements-list' />,
}))

describe('Sidebar', () => {
  const goToMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    jest.mocked(useAuthContext).mockReturnValue({
      user: {
        name: { value: 'Petros' },
        email: { value: 'petros@example.com' },
        avatar: {
          image: { value: 'avatar.png' },
          name: { value: 'Explorer' },
        },
      },
    } as ReturnType<typeof useAuthContext>)

    jest.mocked(useNavigationProvider).mockReturnValue({
      currentRoute: ROUTES.shop,
      goTo: goToMock,
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
    } as ReturnType<typeof useNavigationProvider>)

    jest.mocked(useSiderbarContext).mockReturnValue({
      isOpen: true,
      toggle: jest.fn(),
      isAchievementsListVisible: false,
      setIsAchievementsListVisible: jest.fn(),
    } as ReturnType<typeof useSiderbarContext>)
  })

  it('should expose the Notas action in the mobile sidebar and navigate to ROUTES.notes', async () => {
    const user = userEvent.setup()

    render(<Sidebar />)

    const notesButton = screen.getByRole('button', { name: 'Notas' })

    expect(notesButton).toBeInTheDocument()

    await user.click(notesButton)

    expect(goToMock).toHaveBeenCalledWith(ROUTES.notes)
  })
})
