import type { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { HomeLayoutView } from '../HomeLayoutView'

jest.mock('@/ui/global/widgets/components/PageTransitionAnimation', () => ({
  PageTransitionAnimation: ({ isVisible }: { isVisible: boolean }) => (
    <div data-testid='transition' data-visible={String(isVisible)} />
  ),
}))

jest.mock('@/ui/profile/widgets/layouts/Home/AnimatedContainer', () => ({
  AnimatedContainer: ({ children, onClick }: any) => (
    <button type='button' data-testid='container' onClick={onClick}>
      {children}
    </button>
  ),
}))

jest.mock('@/ui/profile/widgets/layouts/Home/HomeHeader', () => ({
  HomeHeader: () => <div data-testid='header' />,
}))

jest.mock('@/ui/profile/widgets/layouts/Home/HomeNavigation', () => ({
  HomeNavigation: ({ isSidenavExpanded }: { isSidenavExpanded: boolean }) => (
    <div data-testid='navigation' data-expanded={String(isSidenavExpanded)} />
  ),
}))

jest.mock('@/ui/profile/widgets/layouts/Home/TabNav', () => ({
  TabNav: () => <div data-testid='tab-nav' />,
}))

jest.mock('@/ui/profile/widgets/layouts/Home/StreakBreakDialog', () => ({
  StreakBreakDialog: () => <div data-testid='streak-break-dialog' />,
}))

describe('HomeLayoutView', () => {
  function View(props?: Partial<ComponentProps<typeof HomeLayoutView>>) {
    render(
      <HomeLayoutView
        isSidenavExpanded={false}
        isTransitionVisible={true}
        currentRoute='/space'
        onContainerClick={jest.fn()}
        onSidenavToggle={jest.fn()}
        {...props}
      >
        <p>Conteúdo</p>
      </HomeLayoutView>,
    )
  }

  it('should render the header, navigation, tab nav and children on a regular route', () => {
    View()

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
    expect(screen.getByTestId('tab-nav')).toBeInTheDocument()
    expect(screen.getByTestId('streak-break-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('container')).toHaveTextContent('Conteúdo')
  })

  it('should pass the sidenav expansion to the navigation', () => {
    View({ isSidenavExpanded: true })

    expect(screen.getByTestId('navigation')).toHaveAttribute('data-expanded', 'true')
  })

  it('should call onContainerClick when the container is clicked', async () => {
    const user = userEvent.setup()
    const onContainerClick = jest.fn()
    View({ onContainerClick })

    await user.click(screen.getByTestId('container'))

    expect(onContainerClick).toHaveBeenCalledTimes(1)
  })

  it('should render only the transition and the children on a challenge route', () => {
    View({ currentRoute: '/challenging/challenges/abc', isTransitionVisible: false })

    expect(screen.getByTestId('transition')).toHaveAttribute('data-visible', 'false')
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
    expect(screen.queryByTestId('header')).not.toBeInTheDocument()
    expect(screen.queryByTestId('navigation')).not.toBeInTheDocument()
    expect(screen.queryByTestId('tab-nav')).not.toBeInTheDocument()
  })
})
