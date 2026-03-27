import type {
  ChallengeCategoryDto,
  ChallengeDto,
} from '@stardust/core/challenging/entities/dtos'
import type { User } from '@stardust/core/profile/entities'
import { Drawer } from 'vaul'

import { Search } from '@/ui/global/widgets/components/Search'
import { Loading } from '@/ui/global/widgets/components/Loading'
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
  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(shouldBeOpen: boolean) => !shouldBeOpen && onClose()}
    >
      <Drawer.Portal>
        <Drawer.Overlay className='fixed inset-0 z-[500] overflow-y-auto bg-gray-900 bg-opacity-50' />
        <Drawer.Content className='fixed right-0 top-0 z-[500] h-screen w-full max-w-md border-l border-gray-700 bg-gray-950 outline-none'>
          <div className='flex h-full flex-col border-l border-gray-700 bg-gray-950'>
            <div className='border-b border-gray-700 px-4 py-3'>
              <div className='mb-3 flex items-center justify-between gap-3'>
                {isAccountAuthenticated && (
                  <p className='text-sm font-semibold text-gray-200'>
                    {completedChallengesCount ?? 0}/{totalChallengesCount} Resolvidos
                  </p>
                )}

                <button
                  type='button'
                  onClick={onClose}
                  aria-label='Fechar sidebar de desafios'
                  className='ml-auto rounded-md border border-gray-700 px-2 py-1 text-xs font-semibold text-gray-200'
                >
                  Fechar
                </button>
              </div>

              <div className='flex items-center gap-2'>
                <Search
                  id='challenges-navigation-sidebar-search'
                  placeholder='Buscar por titulo'
                  onSearchChange={onSearchChange}
                  className='h-9 bg-gray-900'
                />

                <SidebarFiltersPopover
                  categories={categories}
                  isAccountAuthenticated={isAccountAuthenticated}
                  isLoading={isLoading}
                  activeFiltersCount={activeFiltersCount}
                  appliedFilters={filters}
                  onApplyFilters={onApplyFilters}
                  onClearFilters={onClearFilters}
                />
              </div>
            </div>

            <div className='flex-1 overflow-y-auto px-4 py-3'>
              {isLoading && (
                <div className='flex h-full items-center justify-center'>
                  <Loading isSmall={false} />
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

            <div className='border-t border-gray-700 px-4 py-3'>
              <p className='mb-2 text-xs text-gray-400'>
                Exibindo {paginationStart} - {paginationEnd} de {totalItemsCount}
              </p>
              <div className='flex items-center justify-between gap-2'>
                <button
                  type='button'
                  onClick={onPreviousPageClick}
                  aria-label='Ir para pagina anterior da sidebar de desafios'
                  disabled={isLoading || page <= 1}
                  className='rounded-md border border-gray-700 px-3 py-2 text-xs font-semibold text-gray-200 disabled:opacity-50'
                >
                  Pagina anterior
                </button>

                <span className='text-xs text-gray-300'>
                  {page}/{totalPagesCount}
                </span>

                <button
                  type='button'
                  onClick={onNextPageClick}
                  aria-label='Ir para pagina seguinte da sidebar de desafios'
                  disabled={isLoading || page >= totalPagesCount}
                  className='rounded-md border border-gray-700 px-3 py-2 text-xs font-semibold text-gray-200 disabled:opacity-50'
                >
                  Pagina seguinte
                </button>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
