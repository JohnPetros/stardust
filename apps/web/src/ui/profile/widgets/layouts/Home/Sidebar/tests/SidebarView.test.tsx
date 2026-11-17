import type { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SidebarView } from '../SidebarView'

jest.mock('@/ui/global/widgets/components/UserAvatar', () => ({
  UserAvatar: () => <div data-testid='user-avatar' />,
}))

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: () => <span data-testid='icon' />,
}))

jest.mock('@/ui/global/widgets/components/SignOutAlertDialog', () => ({
  SignOutAlertDialog: ({ children }: any) => <div data-testid='sign-out'>{children}</div>,
}))

jest.mock('@/ui/profile/widgets/layouts/Home/Sidebar/AnimatedBar', () => ({
  AnimatedBar: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/ui/profile/widgets/layouts/Home/AchievementsList', () => ({
  AchievementsList: () => <div data-testid='achievements-list' />,
}))

describe('SidebarView', () => {
  type Props = ComponentProps<typeof SidebarView>

  const View = (props?: Partial<Props>) => {
    render(
      <SidebarView
        isOpen={true}
        toggle={jest.fn()}
        onNotesClick={jest.fn()}
        user={{
          name: 'Petros',
          email: 'petros@example.com',
          avatar: { image: 'avatar.png', name: 'Explorer' },
        }}
        {...props}
      />,
    )
  }

  it('should render the user name and email', () => {
    View()

    expect(screen.getByText('Petros')).toBeInTheDocument()
    expect(screen.getByText('petros@example.com')).toBeInTheDocument()
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument()
  })

  it('should call onNotesClick when the notes button is clicked', async () => {
    const user = userEvent.setup()
    const onNotesClick = jest.fn()
    View({ onNotesClick })

    await user.click(screen.getByRole('button', { name: 'Notas' }))

    expect(onNotesClick).toHaveBeenCalledTimes(1)
  })

  it('should call toggle when the close button is clicked', async () => {
    const user = userEvent.setup()
    const toggle = jest.fn()
    View({ toggle })

    await user.click(screen.getByTestId('icon').closest('button') as HTMLElement)

    expect(toggle).toHaveBeenCalledTimes(1)
  })

  it('should render the sign out button inside the sign out dialog', () => {
    View()

    expect(screen.getByTestId('sign-out')).toContainElement(
      screen.getByRole('button', { name: 'Sair' }),
    )
  })
})
