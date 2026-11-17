import type { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { HomeHeaderView } from '../HomeHeaderView'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}))

jest.mock('@/ui/profile/widgets/layouts/Home/HomeHeader/AnimatedContainer', () => ({
  AnimatedContainer: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/ui/global/widgets/components/CountBadge', () => ({
  CountBadge: ({ count }: { count: number }) => <span data-testid='count'>{count}</span>,
}))

jest.mock('@/ui/global/widgets/components/UserAvatar', () => ({
  UserAvatar: ({ avatarName }: { avatarName: string }) => (
    <span data-testid='avatar'>{avatarName}</span>
  ),
}))

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: ({ name, className }: { name: string; className?: string }) => (
    <span data-testid={`icon-${name}`} className={className} />
  ),
}))

describe('HomeHeaderView', () => {
  function View(props?: Partial<ComponentProps<typeof HomeHeaderView>>) {
    return render(
      <HomeHeaderView
        isSidebarOpen={false}
        rescueableAchievementsCount={2}
        coins={120}
        streak={7}
        isTodayDone={true}
        name='Ada Lovelace'
        email='ada@stardust.local'
        avatarImage='avatar.png'
        avatarName='Ada'
        onSidebarToggle={jest.fn()}
        {...props}
      />,
    )
  }

  it('should tint the fire icon green when today is done', () => {
    View({ isTodayDone: true })

    const fire = screen.getByTestId('icon-fire')
    expect(fire).toHaveClass('text-green-500')
    expect(fire).not.toHaveClass('text-gray-300')
    expect(screen.getByText('7')).toHaveClass('text-green-500')
  })

  it('should tint the fire icon gray when today is not done', () => {
    View({ isTodayDone: false })

    const fire = screen.getByTestId('icon-fire')
    expect(fire).toHaveClass('text-gray-300')
    expect(fire).not.toHaveClass('text-green-500')
    expect(screen.getByText('7')).toHaveClass('text-gray-300')
  })

  it('should render the coins icon with the coins and streak values', () => {
    View({ coins: 340, streak: 12 })

    expect(screen.getByTestId('icon-coins')).toHaveClass('text-yellow-400')
    expect(screen.getByText('340')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('should render the user data and the rescueable achievements count', () => {
    View()

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('ada@stardust.local')).toBeInTheDocument()
    expect(screen.getByTestId('count')).toHaveTextContent('2')
  })

  it('should call onSidebarToggle and expose the sidebar state on the menu button', async () => {
    const onSidebarToggle = jest.fn()
    View({ onSidebarToggle, isSidebarOpen: true })

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-controls', 'sidebar')
    expect(button).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(button)

    expect(onSidebarToggle).toHaveBeenCalledTimes(1)
  })
})
