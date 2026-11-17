import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { HomeNavigationView, type HomeNavigationViewProps } from '../HomeNavigationView'

jest.mock('@/ui/profile/widgets/layouts/Home/Sidenav', () => ({
  Sidenav: ({ onNotesClick, onAchievementsClick }: any) => (
    <div data-testid='sidenav'>
      <button type='button' onClick={onNotesClick}>
        Notas sidenav
      </button>
      <button type='button' onClick={onAchievementsClick}>
        Conquistas sidenav
      </button>
    </div>
  ),
}))

jest.mock('@/ui/profile/widgets/layouts/Home/Sidebar', () => ({
  Sidebar: ({ user, onNotesClick }: any) => (
    <div data-testid='sidebar'>
      <span>{user.name}</span>
      <button type='button' onClick={onNotesClick}>
        Notas sidebar
      </button>
    </div>
  ),
}))

describe('HomeNavigationView', () => {
  const View = (props?: Partial<HomeNavigationViewProps>) => {
    render(
      <HomeNavigationView
        isSidenavExpanded={false}
        onSidenavToggle={jest.fn()}
        isSidebarOpen={false}
        onSidebarToggle={jest.fn()}
        isAchievementsListVisible={false}
        links={[]}
        isNotesActive={false}
        rescueableAchievementsCount={0}
        sidebarUser={{
          name: 'Petros',
          email: 'petros@example.com',
          avatar: { image: 'avatar.png', name: 'Explorer' },
        }}
        onNotesClick={jest.fn()}
        onAchievementsClick={jest.fn()}
        {...props}
      />,
    )
  }

  it('should render the sidenav and the sidebar', () => {
    View()

    expect(screen.getByTestId('sidenav')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByText('Petros')).toBeInTheDocument()
  })

  it('should deliver the same notes handler to the sidenav and the sidebar', async () => {
    const user = userEvent.setup()
    const onNotesClick = jest.fn()
    View({ onNotesClick })

    await user.click(screen.getByRole('button', { name: 'Notas sidenav' }))
    await user.click(screen.getByRole('button', { name: 'Notas sidebar' }))

    expect(onNotesClick).toHaveBeenCalledTimes(2)
  })

  it('should call onAchievementsClick when the achievements button is clicked', async () => {
    const user = userEvent.setup()
    const onAchievementsClick = jest.fn()
    View({ onAchievementsClick })

    await user.click(screen.getByRole('button', { name: 'Conquistas sidenav' }))

    expect(onAchievementsClick).toHaveBeenCalledTimes(1)
  })
})
