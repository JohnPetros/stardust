import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

import { ChallengeCraftsVisibility } from '@stardust/core/challenging/structures'

jest.mock('@radix-ui/react-tabs', () => ({
  Root: ({ children }: any) => <div data-testid='tabs-root'>{children}</div>,
  List: ({ children }: any) => <div data-testid='tabs-list'>{children}</div>,
  Trigger: ({ children, asChild, ...props }: any) => (
    <button type='button' {...props}>
      {children}
    </button>
  ),
}))

jest.mock('../ChallengeTabContent', () => ({
  ChallengeTabContent: ({ children }: any) => (
    <div data-testid='tab-content'>{children}</div>
  ),
}))

jest.mock('@/ui/global/widgets/components/AccountRequirementAlertDialog', () => ({
  AccountRequirementAlertDialog: ({ children }: any) => (
    <div data-testid='account-required'>{children}</div>
  ),
}))

jest.mock('@/ui/challenging/widgets/components/BlockedCommentsAlertDialog', () => ({
  BlockedCommentsAlertDialog: ({ children }: any) => (
    <div data-testid='blocked-comments'>{children}</div>
  ),
}))

jest.mock('@/ui/challenging/widgets/components/BlockedSolutionsAlertDialog', () => ({
  BlockedSolutionsAlertDialog: ({ children, onShowSolutions }: any) => (
    <div data-testid='blocked-solutions'>
      <button type='button' data-testid='show-solutions' onClick={onShowSolutions} />
      {children}
    </div>
  ),
}))

jest.mock('@/ui/challenging/widgets/components/ChallengeContentLink', () => ({
  ChallengeContentLink: ({ title, contentType, isActive, isBlocked }: any) => (
    <span
      data-testid={`content-link-${contentType}`}
      data-active={String(Boolean(isActive))}
      data-blocked={String(Boolean(isBlocked))}
    >
      {title}
    </span>
  ),
}))

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: () => <span data-testid='icon' />,
}))

import { ChallengeTabsView } from '../ChallengeTabsView'

describe('ChallengeTabsView', () => {
  type Props = ComponentProps<typeof ChallengeTabsView>

  const View = (props?: Partial<Props>) => {
    const craftsVislibility = ChallengeCraftsVisibility.create({
      canShowComments: true,
      canShowSolutions: true,
    })

    render(
      <ChallengeTabsView
        activeContent='description'
        craftsVislibility={craftsVislibility}
        isAccountAuthenticated={true}
        onShowSolutions={jest.fn()}
        {...props}
      >
        <div data-testid='tab-children' />
      </ChallengeTabsView>,
    )
  }

  it('should render blocked comments link when comments are hidden', () => {
    const craftsVislibility = ChallengeCraftsVisibility.create({
      canShowComments: false,
      canShowSolutions: true,
    })

    View({ craftsVislibility })

    const commentsLink = screen.getByTestId('content-link-comments')
    expect(commentsLink).toHaveAttribute('data-blocked', 'true')
    expect(screen.getByTestId('blocked-comments')).toBeInTheDocument()
  })

  it('should render account requirement button when user is not authenticated', () => {
    View({ isAccountAuthenticated: false })

    expect(screen.getByTestId('account-required')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Soluções' })).toBeInTheDocument()
  })

  it('should call onShowSolutions when blocked solutions dialog action is triggered', async () => {
    const user = userEvent.setup()
    const onShowSolutions = jest.fn()
    const craftsVislibility = ChallengeCraftsVisibility.create({
      canShowComments: true,
      canShowSolutions: false,
    })

    View({ craftsVislibility, onShowSolutions, isAccountAuthenticated: true })

    await user.click(screen.getByTestId('show-solutions'))

    expect(onShowSolutions).toHaveBeenCalled()
  })
})
