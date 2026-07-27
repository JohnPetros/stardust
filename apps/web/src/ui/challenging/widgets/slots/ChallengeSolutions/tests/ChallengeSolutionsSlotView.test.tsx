import { render, screen } from '@testing-library/react'
import type { CodePlaybackDto } from '@stardust/core/global/structures/dtos'
import { CodePlaybacksFaker } from '@stardust/core/global/structures/fakers'

import { ChallengeSolutionsSlotView, type Props } from '../ChallengeSolutionsSlotView'

jest.mock('@/ui/challenging/widgets/components/ChallengeContentNav', () => ({
  ChallengeContentNav: () => <div data-testid='content-nav' />,
}))
jest.mock('@/ui/global/widgets/components/Search', () => ({
  Search: () => <input aria-label='search' />,
}))
jest.mock('@/ui/global/widgets/components/PopoverMenu', () => ({
  PopoverMenu: ({ children }: { children: (isOpen: boolean) => React.ReactNode }) => (
    <>{children(false)}</>
  ),
}))
jest.mock('@/ui/global/widgets/components/ShowMoreButton', () => ({
  ShowMoreButton: () => <button type='button'>Mais soluções</button>,
}))
jest.mock('@/ui/global/widgets/components/Button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: () => <span aria-hidden='true' />,
}))
jest.mock('../SolutionCard', () => ({
  SolutionCard: ({ title }: { title: string }) => (
    <article data-testid='user-solution-card'>{title}</article>
  ),
}))
jest.mock('../SolutionCardSkeleton', () => ({
  SolutionCardSkeleton: () => <div data-testid='solution-skeleton' />,
}))

const officialSolution = CodePlaybacksFaker.fakeDto() as CodePlaybackDto

const baseProps: Props = {
  solutions: [
    {
      id: 'solution-id',
      title: 'Solução de usuário',
      slug: 'solucao-de-usuario',
      upvotesCount: 1,
      viewsCount: 2,
      commentsCount: 3,
      postedAt: new Date('2026-01-01'),
      author: {
        name: 'Pessoa',
        slug: 'pessoa',
        avatar: { name: 'Avatar', image: '' },
      },
    },
  ],
  officialSolution: null,
  sorter: { value: 'date' },
  isReachedEnd: true,
  isLoading: false,
  isFromUser: false,
  solutionTitle: '',
  popoverMenuButtons: [],
  challengeSlug: 'example',
  isChallengeCompleted: false,
  handleIsFromUserChange: jest.fn(),
  nextPage: jest.fn(),
  handleSolutionTitleChange: jest.fn(),
}

describe('ChallengeSolutionsSlotView', () => {
  it('renders the official card before user solutions when content exists', () => {
    render(
      <ChallengeSolutionsSlotView {...baseProps} officialSolution={officialSolution} />,
    )

    const officialCard = screen.getByTestId('official-solution-card')
    const userCard = screen.getByTestId('user-solution-card')

    expect(officialCard).toBeInTheDocument()
    expect(officialCard.compareDocumentPosition(userCard)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
  })

  it('does not render the official card when content is absent', () => {
    render(<ChallengeSolutionsSlotView {...baseProps} />)

    expect(screen.queryByTestId('official-solution-card')).not.toBeInTheDocument()
    expect(screen.getByTestId('user-solution-card')).toBeInTheDocument()
  })
})
