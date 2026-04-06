import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

import { ChallengeCategoriesFaker } from '@stardust/core/challenging/entities/fakers'
import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'

jest.mock('vaul', () => {
  const Root = ({ children }: any) => <div data-testid='drawer-root'>{children}</div>
  const Portal = ({ children }: any) => <>{children}</>
  const Overlay = ({ children, ...props }: any) => (
    <div data-testid='drawer-overlay' {...props}>
      {children}
    </div>
  )
  const Content = ({ children, ...props }: any) => (
    <div data-testid='drawer-content' {...props}>
      {children}
    </div>
  )
  const Title = ({ children, ...props }: any) => <div {...props}>{children}</div>

  return {
    Drawer: {
      Root,
      Portal,
      Overlay,
      Content,
      Title,
    },
  }
})

jest.mock('@/ui/global/widgets/components/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}))

jest.mock('@/ui/global/widgets/components/Search', () => ({
  Search: ({ onSearchChange, placeholder }: any) => (
    <input
      aria-label='Buscar desafios'
      placeholder={placeholder}
      onChange={(event) => onSearchChange(event.target.value)}
    />
  ),
}))

jest.mock('../SidebarFiltersPopover', () => ({
  SidebarFiltersPopover: ({
    activeFiltersCount,
    onApplyFilters,
    onClearFilters,
  }: any) => (
    <div>
      <span data-testid='active-filters-count'>{activeFiltersCount}</span>
      <button
        type='button'
        onClick={() =>
          onApplyFilters({
            completionStatus: 'completed',
            difficultyLevels: ['medium'],
            categoriesIds: ['22222222-2222-4222-8222-222222222222'],
          })
        }
      >
        Aplicar filtros
      </button>
      <button type='button' onClick={onClearFilters}>
        Limpar filtros
      </button>
    </div>
  ),
}))

jest.mock('../SidebarChallengeItem', () => ({
  SidebarChallengeItem: ({
    title,
    challengeSlug,
    isActive,
    onClick,
    isAccountAuthenticated,
    user,
    challengeId,
  }: any) => (
    <button
      type='button'
      data-testid={`challenge-item-${challengeSlug}`}
      data-active={String(isActive)}
      data-authenticated={String(isAccountAuthenticated)}
      data-completed={String(
        Boolean(
          isAccountAuthenticated &&
            user &&
            challengeId &&
            user.dto.completedChallengesIds.includes(challengeId),
        ),
      )}
      onClick={() => onClick(challengeSlug)}
    >
      {title}
    </button>
  ),
}))

import { ChallengesNavigationSidebarView } from '../ChallengesNavigationSidebarView'

describe('ChallengesNavigationSidebarView', () => {
  type Props = ComponentProps<typeof ChallengesNavigationSidebarView>

  const categories = [
    ChallengeCategoriesFaker.fakeDto({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Loops',
    }),
    ChallengeCategoriesFaker.fakeDto({
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Arrays',
    }),
  ]
  const challenges = [
    ChallengesFaker.fakeDto({
      id: '33333333-3333-4333-8333-333333333333',
      slug: 'desafio-1',
      title: 'Desafio 1',
      difficultyLevel: 'easy',
    }),
    ChallengesFaker.fakeDto({
      id: '44444444-4444-4444-8444-444444444444',
      slug: 'desafio-2',
      title: 'Desafio 2',
      difficultyLevel: 'medium',
    }),
  ]

  const View = (props?: Partial<Props>) => {
    const user =
      props?.user === undefined
        ? UsersFaker.fake({
            completedChallengesIds: ['44444444-4444-4444-8444-444444444444'],
          })
        : props.user

    render(
      <ChallengesNavigationSidebarView
        isOpen={true}
        isLoading={false}
        errorMessage={null}
        isEmpty={false}
        isAccountAuthenticated={true}
        completedChallengesCount={1}
        totalChallengesCount={8}
        categories={categories}
        challenges={challenges}
        currentChallengeSlug='desafio-2'
        user={user}
        activeFiltersCount={2}
        filters={{
          completionStatus: 'completed',
          difficultyLevels: ['medium'],
          categoriesIds: ['22222222-2222-4222-8222-222222222222'],
        }}
        page={2}
        totalPagesCount={4}
        paginationStart={21}
        paginationEnd={40}
        totalItemsCount={71}
        onClose={jest.fn()}
        onSearchChange={jest.fn()}
        onApplyFilters={jest.fn()}
        onClearFilters={jest.fn()}
        onPreviousPageClick={jest.fn()}
        onNextPageClick={jest.fn()}
        onChallengeClick={jest.fn()}
        onRetry={jest.fn()}
        {...props}
      />,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the loading state with skeleton items and disabled pagination', () => {
    const { container } = render(
      <ChallengesNavigationSidebarView
        isOpen={true}
        isLoading={true}
        errorMessage={null}
        isEmpty={false}
        isAccountAuthenticated={true}
        completedChallengesCount={1}
        totalChallengesCount={8}
        categories={categories}
        challenges={[]}
        currentChallengeSlug='desafio-2'
        user={UsersFaker.fake()}
        activeFiltersCount={0}
        filters={{ completionStatus: 'all', difficultyLevels: [], categoriesIds: [] }}
        page={1}
        totalPagesCount={4}
        paginationStart={0}
        paginationEnd={0}
        totalItemsCount={0}
        onClose={jest.fn()}
        onSearchChange={jest.fn()}
        onApplyFilters={jest.fn()}
        onClearFilters={jest.fn()}
        onPreviousPageClick={jest.fn()}
        onNextPageClick={jest.fn()}
        onChallengeClick={jest.fn()}
        onRetry={jest.fn()}
      />,
    )

    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(7)
    expect(
      screen.getByRole('button', {
        name: 'Ir para pagina anterior da sidebar de desafios',
      }),
    ).toBeDisabled()
    expect(
      screen.getByRole('button', {
        name: 'Ir para pagina seguinte da sidebar de desafios',
      }),
    ).toBeDisabled()
  })

  it('should render the error state and retry action', async () => {
    const user = userEvent.setup()
    const onRetry = jest.fn()

    View({ errorMessage: 'Falha ao carregar desafios.', isEmpty: false, onRetry })

    expect(screen.getByText('Falha ao carregar desafios.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('should render the empty state message when there are no results', () => {
    View({ isEmpty: true, challenges: [] })

    expect(
      screen.getByText('Nenhum desafio encontrado para os filtros atuais.'),
    ).toBeInTheDocument()
  })

  it('should render the content state with active challenge, resolved counter and filter chips', async () => {
    const user = userEvent.setup()
    const onSearchChange = jest.fn()
    const onApplyFilters = jest.fn()
    const onClearFilters = jest.fn()
    const onChallengeClick = jest.fn()

    View({ onSearchChange, onApplyFilters, onClearFilters, onChallengeClick })

    expect(screen.getByText('1/8 Resolvidos')).toBeInTheDocument()
    expect(screen.getByText('Médio')).toBeInTheDocument()
    expect(screen.getByText('Concluído')).toBeInTheDocument()
    expect(screen.getByText('Arrays')).toBeInTheDocument()
    expect(screen.getByTestId('active-filters-count')).toHaveTextContent('2')
    expect(screen.getByTestId('challenge-item-desafio-1')).toHaveAttribute(
      'data-active',
      'false',
    )
    expect(screen.getByTestId('challenge-item-desafio-2')).toHaveAttribute(
      'data-active',
      'true',
    )
    expect(screen.getByTestId('challenge-item-desafio-2')).toHaveAttribute(
      'data-completed',
      'true',
    )

    await user.type(screen.getByRole('textbox', { name: 'Buscar desafios' }), 'pilha')
    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }))
    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    await user.click(screen.getByTestId('challenge-item-desafio-1'))

    expect(onSearchChange).toHaveBeenLastCalledWith('pilha')
    expect(onApplyFilters).toHaveBeenCalledWith({
      completionStatus: 'completed',
      difficultyLevels: ['medium'],
      categoriesIds: ['22222222-2222-4222-8222-222222222222'],
    })
    expect(onClearFilters).toHaveBeenCalledTimes(1)
    expect(onChallengeClick).toHaveBeenCalledWith('desafio-1')
  })

  it('should hide the resolved counter for anonymous users', () => {
    View({ isAccountAuthenticated: false, user: null })

    expect(screen.queryByText('1/8 Resolvidos')).not.toBeInTheDocument()
  })

  it('should handle pagination controls according to the current page', async () => {
    const user = userEvent.setup()
    const onPreviousPageClick = jest.fn()
    const onNextPageClick = jest.fn()

    View({ onPreviousPageClick, onNextPageClick, page: 2, totalPagesCount: 4 })

    expect(screen.getByText('Exibindo 21 - 40 de 71')).toBeInTheDocument()
    expect(screen.getByText('2/4')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: 'Ir para pagina anterior da sidebar de desafios',
      }),
    )
    await user.click(
      screen.getByRole('button', {
        name: 'Ir para pagina seguinte da sidebar de desafios',
      }),
    )

    expect(onPreviousPageClick).toHaveBeenCalledTimes(1)
    expect(onNextPageClick).toHaveBeenCalledTimes(1)
  })

  it('should disable the next button on the last page', () => {
    View({ page: 4, totalPagesCount: 4 })

    expect(
      screen.getByRole('button', {
        name: 'Ir para pagina seguinte da sidebar de desafios',
      }),
    ).toBeDisabled()
  })
})
