import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps, ReactNode } from 'react'

import { ChallengeSourcesFaker } from '@stardust/core/challenging/entities/fakers'

jest.mock('@/constants/env', () => ({
  ENV: {
    stardustWebAppUrl: 'https://stardust-web.test',
  },
}))

jest.mock('../ChallengeSourceForm', () => ({
  ChallengeSourceForm: () => <div data-testid='challenge-source-form' />,
}))

jest.mock('../DeleteChallengeSourceDialog', () => ({
  DeleteChallengeSourceDialog: ({
    onConfirm,
    children,
  }: {
    onConfirm: () => void
    children: ReactNode
  }) => (
    <div>
      {children}
      <button type='button' onClick={onConfirm}>
        Confirmar remoção
      </button>
    </div>
  ),
}))

jest.mock('@/ui/global/widgets/components/Pagination', () => ({
  Pagination: ({
    onNextPage,
    onPrevPage,
    onPageChange,
    onItemsPerPageChange,
  }: {
    onNextPage: () => void
    onPrevPage: () => void
    onPageChange: (page: number) => void
    onItemsPerPageChange: (itemsPerPage: number) => void
  }) => (
    <div>
      <button type='button' onClick={onPrevPage}>
        Prev page
      </button>
      <button type='button' onClick={onNextPage}>
        Next page
      </button>
      <button type='button' onClick={() => onPageChange(3)}>
        Go page 3
      </button>
      <button type='button' onClick={() => onItemsPerPageChange(25)}>
        Items 25
      </button>
    </div>
  ),
}))

import { ChallengeSourcesPageView } from '../ChallengeSourcesPageView'

describe('ChallengeSourcesPageView', () => {
  type Props = ComponentProps<typeof ChallengeSourcesPageView>

  const sourceA = ChallengeSourcesFaker.fakeDto({
    id: 'source-a',
    url: 'https://source-a.test',
    challenge: {
      id: 'challenge-a',
      title: 'Challenge A',
      slug: 'challenge-a',
    },
    isUsed: true,
  })

  const sourceB = ChallengeSourcesFaker.fakeDto({
    id: 'source-b',
    url: 'https://source-b.test',
  })

  const defaultProps: Props = {
    search: '',
    page: 1,
    totalPages: 2,
    totalItemsCount: 2,
    itemsPerPage: 10,
    challengeSources: [sourceA, sourceB],
    sortableChallengeSources: [
      { id: sourceA.id, data: sourceA },
      { id: sourceB.id, data: sourceB },
    ],
    sortableKey: `${sourceA.id}-${sourceB.id}`,
    isLoading: false,
    isReordering: false,
    onSearchChange: jest.fn(),
    onPageChange: jest.fn(),
    onNextPage: jest.fn(),
    onPrevPage: jest.fn(),
    onItemsPerPageChange: jest.fn(),
    onCreateChallengeSource: jest.fn(async () => null),
    onUpdateChallengeSource: jest.fn(async () => null),
    onDeleteChallengeSource: jest.fn(async () => undefined),
    onReorderChallengeSources: jest.fn(async () => undefined),
  }

  const View = (props?: Partial<Props>) =>
    render(<ChallengeSourcesPageView {...defaultProps} {...props} />)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render title, search input and add form', () => {
    View()

    expect(screen.getByText('Fontes de desafios')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Buscar por título do desafio...'),
    ).toBeInTheDocument()
    expect(screen.getAllByTestId('challenge-source-form')).toHaveLength(3)
  })

  it('should render loading state', () => {
    View({ isLoading: true, sortableChallengeSources: [] })

    expect(screen.getByText('Carregando fontes...')).toBeInTheDocument()
  })

  it('should render empty state when there are no sources', () => {
    View({ sortableChallengeSources: [] })

    expect(
      screen.getByText('Nenhuma fonte encontrada para os filtros atuais'),
    ).toBeInTheDocument()
  })

  it('should render source and challenge links', () => {
    View()

    expect(screen.getByRole('link', { name: sourceA.url })).toHaveAttribute(
      'href',
      sourceA.url,
    )

    const challengeUrl = 'https://stardust-web.test/challenging/challenges/challenge-a'
    expect(screen.getByRole('link', { name: challengeUrl })).toHaveAttribute(
      'href',
      challengeUrl,
    )

    expect(screen.getAllByText('Sim')).toHaveLength(2)
  })

  it('should call onSearchChange when user types in search input', async () => {
    const user = userEvent.setup()
    const onSearchChange = jest.fn()

    View({ onSearchChange })

    await user.type(
      screen.getByPlaceholderText('Buscar por título do desafio...'),
      'binary',
    )

    expect(onSearchChange).toHaveBeenCalled()
    expect(onSearchChange).toHaveBeenLastCalledWith('y')
  })

  it('should call onReorderChallengeSources when moving an item down', async () => {
    const user = userEvent.setup()
    const onReorderChallengeSources = jest.fn(async () => undefined)

    View({ onReorderChallengeSources })

    const firstRow = screen.getByText(sourceA.challenge.title).closest('tr')
    if (!firstRow) throw new Error('First row not found')

    const buttons = within(firstRow).getAllByRole('button')
    const moveDownButton = buttons[1]

    await user.click(moveDownButton)

    expect(onReorderChallengeSources).toHaveBeenCalledWith([sourceB, sourceA])
  })

  it('should call onDeleteChallengeSource with the selected source id', async () => {
    const user = userEvent.setup()
    const onDeleteChallengeSource = jest.fn(async () => undefined)

    View({ onDeleteChallengeSource })

    await user.click(screen.getAllByRole('button', { name: 'Confirmar remoção' })[0])

    expect(onDeleteChallengeSource).toHaveBeenCalledWith(sourceA.id)
  })

  it('should call pagination handlers from pagination actions', async () => {
    const user = userEvent.setup()
    const onNextPage = jest.fn()
    const onPrevPage = jest.fn()
    const onPageChange = jest.fn()
    const onItemsPerPageChange = jest.fn()

    View({ onNextPage, onPrevPage, onPageChange, onItemsPerPageChange })

    await user.click(screen.getByRole('button', { name: 'Prev page' }))
    await user.click(screen.getByRole('button', { name: 'Next page' }))
    await user.click(screen.getByRole('button', { name: 'Go page 3' }))
    await user.click(screen.getByRole('button', { name: 'Items 25' }))

    expect(onPrevPage).toHaveBeenCalled()
    expect(onNextPage).toHaveBeenCalled()
    expect(onPageChange).toHaveBeenCalledWith(3)
    expect(onItemsPerPageChange).toHaveBeenCalledWith(25)
  })
})
