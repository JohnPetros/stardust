import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ROUTES } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useSiderbarContext } from '@/ui/profile/contexts/SidebarContext'
import { Sidenav } from '..'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

jest.mock('@/ui/auth/contexts/AuthContext', () => ({
  useAuthContext: jest.fn(),
}))

jest.mock('@/ui/global/hooks/useNavigationProvider', () => ({
  useNavigationProvider: jest.fn(),
}))

jest.mock('@/ui/profile/contexts/SidebarContext', () => ({
  useSiderbarContext: jest.fn(),
}))

jest.mock('@/ui/profile/widgets/layouts/Home/NavLink', () => ({
  NavLink: ({ label }: { label: string }) => <a href='/mock'>{label}</a>,
}))

jest.mock('@/ui/profile/widgets/layouts/Home/AchievementsList', () => ({
  AchievementsList: () => <div data-testid='achievements-list' />,
}))

jest.mock('@/ui/profile/widgets/layouts/Home/Sidenav/AnimatedAchievementsList', () => ({
  AnimatedAchievementsList: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/ui/profile/widgets/layouts/Home/Sidenav/AnimatedContainer', () => ({
  AnimatedContainer: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/ui/profile/widgets/layouts/Home/Sidenav/SidenavButton', () => ({
  SidenavButton: ({ title, onClick, isActive }: any) => (
    <button type='button' onClick={onClick} data-active={String(isActive)}>
      {title}
    </button>
  ),
}))

jest.mock('@/ui/global/widgets/components/CountBadge', () => ({
  CountBadge: ({ count }: { count: number }) => <span>{count}</span>,
}))

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: () => <span data-testid='icon' />,
}))

jest.mock('@/ui/global/widgets/components/SignOutAlertDialog', () => ({
  SignOutAlertDialog: ({ children }: any) => <>{children}</>,
}))

describe('Sidenav', () => {
  const goToMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    jest.mocked(useAuthContext).mockReturnValue({
      user: {
        slug: { value: 'petros' },
        rescueableAchievementsCount: { value: 2 },
      },
    } as ReturnType<typeof useAuthContext>)

    jest.mocked(useNavigationProvider).mockReturnValue({
      currentRoute: ROUTES.notes,
      goTo: goToMock,
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
    } as ReturnType<typeof useNavigationProvider>)

    jest.mocked(useSiderbarContext).mockReturnValue({
      isOpen: false,
      toggle: jest.fn(),
      isAchievementsListVisible: false,
      setIsAchievementsListVisible: jest.fn(),
    } as ReturnType<typeof useSiderbarContext>)
  })

  it('should expose the Notas entry for authenticated users and navigate to ROUTES.notes', async () => {
    const user = userEvent.setup()

    render(<Sidenav isExpanded={true} toggleSidenav={jest.fn()} />)

    const notesButton = screen.getByRole('button', { name: 'Notas' })

    expect(notesButton).toBeInTheDocument()
    expect(notesButton).toHaveAttribute('data-active', 'true')

    await user.click(notesButton)

    expect(goToMock).toHaveBeenCalledWith(ROUTES.notes)
  })
})
