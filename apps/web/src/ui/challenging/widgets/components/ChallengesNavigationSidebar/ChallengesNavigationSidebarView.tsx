import type {
  ChallengeCategoryDto,
  ChallengeDto,
} from '@stardust/core/challenging/entities/dtos'
import type { User } from '@stardust/core/profile/entities'
import { Drawer } from 'vaul'

import { Search } from '@/ui/global/widgets/components/Search'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { SidebarFiltersPopover } from './SidebarFiltersPopover'
import { SidebarChallengeItem } from './SidebarChallengeItem'

type Filters = {
  completionStatus: 'all' | 'completed' | 'not-completed'
  difficultyLevels: string[]
  categoriesIds: string[]
}

type Props = {
  isOpen: boolean
  isLoading: boolean
  errorMessage: string | null
  isEmpty: boolean
  isAccountAuthenticated: boolean
  completedChallengesCount: number | null
  totalChallengesCount: number
  categories: ChallengeCategoryDto[]
  challenges: ChallengeDto[]
  currentChallengeSlug: string
  user: User | null
  activeFiltersCount: number
  filters: Filters
  page: number
  totalPagesCount: number
  paginationStart: number
  paginationEnd: number
  totalItemsCount: number
  onClose: () => void
  onSearchChange: (value: string) => void
  onApplyFilters: (filters: Filters) => void
  onClearFilters: () => void
  onPreviousPageClick: () => void
  onNextPageClick: () => void
  onChallengeClick: (challengeSlug: string) => void
  onRetry: () => void
}

export const ChallengesNavigationSidebarView = ({
  isOpen,
  isLoading,
  errorMessage,
  isEmpty,
  isAccountAuthenticated,
  completedChallengesCount,
  totalChallengesCount,
  categories,
  challenges,
  currentChallengeSlug,
  user,
  activeFiltersCount,
  filters,
  page,
  totalPagesCount,
  paginationStart,
  paginationEnd,
  totalItemsCount,
  onClose,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
  onPreviousPageClick,
  onNextPageClick,
  onChallengeClick,
  onRetry,
}: Props) => {
  const selectedDifficulty = filters.difficultyLevels[0]
  const difficultyChipByLevel: Record<string, { label: string; className: string }> = {
    easy: {
      label: 'Fácil',
      className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    medium: {
      label: 'Médio',
      className: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    },
    hard: { label: 'Difícil', className: 'bg-red-500/15 text-red-300 border-red-500/30' },
  }
  const completionChip =
    filters.completionStatus === 'completed'
      ? {
          label: 'Concluído',
          className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        }
      : filters.completionStatus === 'not-completed'
        ? {
            label: 'Pendente',
            className: 'bg-gray-500/15 text-gray-300 border-gray-500/30',
          }
        : null
  const selectedCategory = categories.find(
    (category) => category.id && filters.categoriesIds.includes(category.id),
  )

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(shouldBeOpen: boolean) => !shouldBeOpen && onClose()}
    >
      <Drawer.Portal>
        <Drawer.Overlay className='fixed inset-0 z-[500] overflow-y-auto bg-gray-800 bg-opacity-50' />
        <Drawer.Content className='fixed right-0 top-0 z-[500] h-screen w-full max-w-[500px] border-l border-emerald-500/10 bg-[#050b11] outline-none'>
          <Drawer.Title className='sr-only'>Navegacao de Desafios</Drawer.Title>
          <div className='flex h-full flex-col border-l border-emerald-500/10 bg-gradient-to-b from-[#08131c] via-[#061019] to-[#04090e]'>
            <div className='border-b border-emerald-500/10 px-4 py-3'>
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <h2 className='text-lg font-semibold leading-tight text-gray-100'>
                    Navegação de Desafios
                  </h2>
                  {isAccountAuthenticated && (
                    <p className='mt-1 text-xs font-semibold text-emerald-400'>
                      {completedChallengesCount ?? 0}/{totalChallengesCount} Resolvidos
                    </p>
                  )}
                </div>

                <button
                  type='button'
                  onClick={onClose}
                  aria-label='Fechar sidebar de desafios'
                  className='rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-900 hover:text-gray-200'
                >
                  <Icon name='close' size={16} />
                </button>
              </div>

              <div className='mt-3 flex items-center gap-2'>
                <Search
                  id='challenges-navigation-sidebar-search'
                  placeholder='Buscar desafios...'
                  onSearchChange={onSearchChange}
                  className='h-9 rounded-lg border-gray-800 bg-[#07121a]'
                />
              </div>

              <div className='mt-3 flex flex-wrap items-center gap-2'>
                <SidebarFiltersPopover
                  categories={categories}
                  isAccountAuthenticated={isAccountAuthenticated}
                  isLoading={isLoading}
                  activeFiltersCount={activeFiltersCount}
                  appliedFilters={filters}
                  onApplyFilters={onApplyFilters}
                  onClearFilters={onClearFilters}
                />

                {selectedDifficulty && difficultyChipByLevel[selectedDifficulty] && (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${difficultyChipByLevel[selectedDifficulty].className}`}
                  >
                    {difficultyChipByLevel[selectedDifficulty].label}
                  </span>
                )}

                {completionChip && (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${completionChip.className}`}
                  >
                    {completionChip.label}
                  </span>
                )}

                {selectedCategory && (
                  <span className='rounded-full border border-violet-500/30 bg-violet-500/15 px-2 py-0.5 text-xs font-medium text-violet-300'>
                    {selectedCategory.name}
                  </span>
                )}
              </div>
            </div>

            <div className='flex-1 overflow-y-auto px-4 py-3'>
              {isLoading && (
                <div className='space-y-2'>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div
                      key={`sidebar-challenge-skeleton-${index}`}
                      className='animate-pulse rounded-xl border border-gray-800 bg-[#071118] px-3 py-2.5'
                    >
                      <div className='flex items-center justify-between gap-3'>
                        <div className='flex min-w-0 items-center gap-2'>
                          <span className='h-3.5 w-3.5 shrink-0 rounded-full border border-gray-700' />
                          <div className='min-w-0'>
                            <div className='h-3.5 w-44 rounded bg-gray-800/80' />
                            <div className='mt-1.5 h-3 w-16 rounded bg-gray-800/70' />
                          </div>
                        </div>
                        <span className='h-3 w-3 rounded bg-gray-800/70' />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && errorMessage && (
                <div className='flex h-full flex-col items-center justify-center gap-3 text-center'>
                  <p className='text-sm text-red-500'>{errorMessage}</p>
                  <button
                    type='button'
                    onClick={onRetry}
                    className='rounded-md border border-gray-700 px-3 py-2 text-xs font-semibold text-gray-200'
                  >
                    Tentar novamente
                  </button>
                </div>
              )}

              {!isLoading && !errorMessage && isEmpty && (
                <div className='flex h-full items-center justify-center text-center'>
                  <p className='text-sm text-gray-300'>
                    Nenhum desafio encontrado para os filtros atuais.
                  </p>
                </div>
              )}

              {!isLoading && !errorMessage && !isEmpty && (
                <ul className='space-y-2'>
                  {challenges.map((challenge) => (
                    <li key={challenge.slug ?? challenge.id}>
                      <SidebarChallengeItem
                        challengeId={challenge.id}
                        challengeSlug={challenge.slug}
                        title={challenge.title}
                        difficultyLevel={challenge.difficultyLevel}
                        isActive={challenge.slug === currentChallengeSlug}
                        user={user}
                        isAccountAuthenticated={isAccountAuthenticated}
                        onClick={onChallengeClick}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className='border-t border-emerald-500/10 px-4 py-3'>
              <p className='mb-2 text-xs text-gray-500'>
                Exibindo {paginationStart} - {paginationEnd} de {totalItemsCount}
              </p>
              <div className='flex items-center justify-between gap-2'>
                <button
                  type='button'
                  onClick={onPreviousPageClick}
                  aria-label='Ir para pagina anterior da sidebar de desafios'
                  disabled={isLoading || page <= 1}
                  className='rounded-lg border border-gray-800 bg-[#07121a] px-3 py-1.5 text-xs font-medium text-gray-300 disabled:opacity-50'
                >
                  Anterior
                </button>

                <span className='text-xs text-gray-400'>
                  {page}/{totalPagesCount}
                </span>

                <button
                  type='button'
                  onClick={onNextPageClick}
                  aria-label='Ir para pagina seguinte da sidebar de desafios'
                  disabled={isLoading || page >= totalPagesCount}
                  className='rounded-lg border border-gray-800 bg-[#07121a] px-3 py-1.5 text-xs font-medium text-gray-300 disabled:opacity-50'
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
