import type { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SidenavView } from '../SidenavView'

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

jest.mock('@/ui/profile/widgets/layouts/Home/NavLink', () => ({
  NavLink: ({ label, route }: { label: string; route: string }) => (
    <a href={route}>{label}</a>
  ),
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
  SidenavButton: ({ title, onClick, isActive, countBadge }: any) => (
    <button type='button' onClick={onClick} data-active={String(isActive)}>
      {title}
      {countBadge}
    </button>
  ),
}))

jest.mock('@/ui/global/widgets/components/CountBadge', () => ({
  CountBadge: ({ count }: { count: number }) => <span data-testid='count'>{count}</span>,
}))

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}))

jest.mock('@/ui/global/widgets/components/SignOutAlertDialog', () => ({
  SignOutAlertDialog: ({ children }: any) => <>{children}</>,
}))

describe('SidenavView', () => {
  type Props = ComponentProps<typeof SidenavView>

  const View = (props?: Partial<Props>) => {
    render(
      <SidenavView
        isExpanded={true}
        isAchievementsListVisible={false}
        links={[
          { route: '/space', label: 'Aprender', icon: 'graduation-cap' },
          { route: '/profile/petros', label: 'Perfil', icon: 'person' },
        ]}
        isNotesActive={false}
        rescueableAchievementsCount={2}
        onToggleSidenav={jest.fn()}
        onNotesClick={jest.fn()}
        onAchievementsClick={jest.fn()}
        {...props}
      />,
    )
  }

  it('should render the received links', () => {
    View()

    expect(screen.getByText('Aprender')).toBeInTheDocument()
    expect(screen.getByText('Perfil')).toBeInTheDocument()
  })

  it('should call onNotesClick when the notes button is clicked', async () => {
    const user = userEvent.setup()
    const onNotesClick = jest.fn()
    View({ onNotesClick })

    await user.click(screen.getByRole('button', { name: 'Notas' }))

    expect(onNotesClick).toHaveBeenCalledTimes(1)
  })

  it('should mark the notes button as active only when isNotesActive is true', () => {
    View({ isNotesActive: true })

    expect(screen.getByRole('button', { name: 'Notas' })).toHaveAttribute(
      'data-active',
      'true',
    )
  })

  it('should call onAchievementsClick and show the rescueable count', async () => {
    const user = userEvent.setup()
    const onAchievementsClick = jest.fn()
    View({ onAchievementsClick })

    expect(screen.getByTestId('count')).toHaveTextContent('2')

    await user.click(screen.getByRole('button', { name: /^Conquistas/ }))

    expect(onAchievementsClick).toHaveBeenCalledTimes(1)
  })

  it('should mark the achievements button as active when the list is visible', () => {
    View({ isAchievementsListVisible: true })

    expect(screen.getByRole('button', { name: /^Conquistas/ })).toHaveAttribute(
      'data-active',
      'true',
    )
  })

  it('should call onToggleSidenav when the expand button is clicked', async () => {
    const user = userEvent.setup()
    const onToggleSidenav = jest.fn()
    View({ onToggleSidenav })

    await user.click(
      screen.getByRole('button', { name: 'Expandir barra de navegação lateral' }),
    )

    expect(onToggleSidenav).toHaveBeenCalledTimes(1)
  })

  it('should show the left chevron when expanded', () => {
    View({ isExpanded: true })

    expect(screen.getByTestId('icon-simple-arrow-left')).toBeInTheDocument()
  })

  it('should show the right chevron when collapsed', () => {
    View({ isExpanded: false })

    expect(screen.getByTestId('icon-simple-arrow-right')).toBeInTheDocument()
  })
})
