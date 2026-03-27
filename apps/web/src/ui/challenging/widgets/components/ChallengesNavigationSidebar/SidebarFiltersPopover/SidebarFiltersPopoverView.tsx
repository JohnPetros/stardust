import { twMerge } from 'tailwind-merge'

type Category = {
  id: string
  name: string
}

type Filters = {
  completionStatus: 'all' | 'completed' | 'not-completed'
  difficultyLevels: string[]
  categoriesIds: string[]
}

type Props = {
  categories: Category[]
  isOpen: boolean
  isAccountAuthenticated: boolean
  isLoading: boolean
  activeFiltersCount: number
  draftFilters: Filters
  onOpenChange: (isOpen: boolean) => void
  onCompletionStatusChange: (status: Filters['completionStatus']) => void
  onDifficultyChange: (difficultyLevel: string) => void
  onCategoryToggle: (categoryId: string) => void
  onApply: () => void
  onClear: () => void
}

export const SidebarFiltersPopoverView = ({
  categories,
  isOpen,
  isAccountAuthenticated,
  isLoading,
  activeFiltersCount,
  draftFilters,
  onOpenChange,
  onCompletionStatusChange,
  onDifficultyChange,
  onCategoryToggle,
  onApply,
  onClear,
}: Props) => {
  return (
    <div className='relative'>
      <button
        type='button'
        aria-label='Abrir filtros da sidebar de desafios'
        disabled={isLoading}
        onClick={() => onOpenChange(!isOpen)}
        className='inline-flex h-9 items-center gap-2 rounded-md border border-gray-700 bg-gray-900 px-3 text-sm font-semibold text-gray-100 disabled:opacity-60'
      >
        Filtros
        {activeFiltersCount > 0 && (
          <span className='inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-xs text-white'>
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 z-50 mt-2 w-80 rounded-lg border border-gray-700 bg-gray-900 p-3 shadow-lg'>
          {isAccountAuthenticated && (
            <div className='mb-3'>
              <p className='mb-2 text-xs font-semibold uppercase text-gray-400'>Status</p>
              <div className='flex gap-2'>
                {[
                  { value: 'all', label: 'Todos' },
                  { value: 'completed', label: 'Resolvidos' },
                  { value: 'not-completed', label: 'Nao resolvidos' },
                ].map((status) => (
                  <button
                    key={status.value}
                    type='button'
                    onClick={() =>
                      onCompletionStatusChange(
                        status.value as 'all' | 'completed' | 'not-completed',
                      )
                    }
                    className={twMerge(
                      'rounded-md border px-2 py-1 text-xs font-semibold',
                      draftFilters.completionStatus === status.value
                        ? 'border-blue-500 text-blue-100'
                        : 'border-gray-700 text-gray-300',
                    )}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className='mb-3'>
            <p className='mb-2 text-xs font-semibold uppercase text-gray-400'>
              Dificuldade
            </p>
            <div className='flex gap-2'>
              {[
                { value: 'all', label: 'Todas' },
                { value: 'easy', label: 'Fácil' },
                { value: 'medium', label: 'Médio' },
                { value: 'hard', label: 'Difícil' },
              ].map((difficulty) => {
                const isActive =
                  (difficulty.value === 'all' &&
                    draftFilters.difficultyLevels.length === 0) ||
                  draftFilters.difficultyLevels.includes(difficulty.value)

                return (
                  <button
                    key={difficulty.value}
                    type='button'
                    onClick={() => onDifficultyChange(difficulty.value)}
                    className={twMerge(
                      'rounded-md border px-2 py-1 text-xs font-semibold',
                      isActive
                        ? 'border-blue-500 text-blue-100'
                        : 'border-gray-700 text-gray-300',
                    )}
                  >
                    {difficulty.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className='mb-2 text-xs font-semibold uppercase text-gray-400'>
              Categorias
            </p>
            <div className='mb-3 flex max-h-28 flex-wrap gap-2 overflow-y-auto'>
              {categories.map((category) => {
                const isActive = draftFilters.categoriesIds.includes(category.id)
                return (
                  <button
                    key={category.id}
                    type='button'
                    onClick={() => onCategoryToggle(category.id)}
                    className={twMerge(
                      'rounded-md border px-2 py-1 text-xs font-semibold',
                      isActive
                        ? 'border-blue-500 text-blue-100'
                        : 'border-gray-700 text-gray-300',
                    )}
                  >
                    {category.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className='flex items-center justify-end gap-2 border-t border-gray-700 pt-3'>
            <button
              type='button'
              onClick={onClear}
              className='rounded-md border border-gray-700 px-3 py-1 text-xs font-semibold text-gray-200'
            >
              Limpar
            </button>
            <button
              type='button'
              onClick={onApply}
              className='rounded-md border border-blue-500 bg-blue-600 px-3 py-1 text-xs font-semibold text-white'
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
