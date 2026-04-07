import { twMerge } from 'tailwind-merge'
import { Icon } from '@/ui/global/widgets/components/Icon'

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
        className='inline-flex h-7 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 text-xs font-semibold text-emerald-300 disabled:opacity-60'
      >
        <Icon name='menu' size={12} />
        Filtros
        {activeFiltersCount > 0 && (
          <span className='inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-xs text-white'>
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-cyan-900/40 bg-[#07131a] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.45)]'>
          <div className='mb-4 flex items-center justify-between'>
            <p className='text-xl font-semibold leading-none text-gray-100'>
              Filtrar desafios
            </p>
            <button
              type='button'
              onClick={onClear}
              className='text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300'
            >
              Limpar tudo
            </button>
          </div>

          {isAccountAuthenticated && (
            <div className='mb-4'>
              <p className='mb-2 text-base font-semibold text-gray-300'>Status</p>
              <div className='flex gap-2'>
                {[
                  { value: 'all', label: 'Todos' },
                  { value: 'completed', label: 'Resolvidos' },
                  { value: 'not-completed', label: 'Nao concluido' },
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
                      'rounded-full border px-3 py-1.5 text-xs font-semibold',
                      draftFilters.completionStatus === status.value
                        ? 'border-transparent bg-emerald-500/20 text-emerald-300'
                        : 'border-cyan-900/50 bg-transparent text-gray-300',
                    )}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className='mb-4'>
            <p className='mb-2 text-base font-semibold text-gray-300'>Dificuldade</p>
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
                      'rounded-full border px-3 py-1.5 text-xs font-semibold',
                      isActive && difficulty.value === 'easy'
                        ? 'border-transparent bg-emerald-500/20 text-emerald-300'
                        : isActive && difficulty.value === 'medium'
                          ? 'border-transparent bg-yellow-500/20 text-yellow-300'
                          : isActive && difficulty.value === 'hard'
                            ? 'border-transparent bg-red-500/20 text-red-300'
                            : isActive
                              ? 'border-transparent bg-emerald-500/20 text-emerald-300'
                              : 'border-cyan-900/50 bg-transparent text-gray-300',
                    )}
                  >
                    {difficulty.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className='mb-2 text-base font-semibold text-gray-300'>Tags</p>
            <div className='mb-3 flex max-h-28 flex-wrap gap-2 overflow-y-auto'>
              {categories.map((category) => {
                const isActive = draftFilters.categoriesIds.includes(category.id)
                return (
                  <button
                    key={category.id}
                    type='button'
                    onClick={() => onCategoryToggle(category.id)}
                    className={twMerge(
                      'rounded-full border px-3 py-1.5 text-xs font-semibold',
                      isActive
                        ? 'border-transparent bg-gray-100 text-gray-900'
                        : 'border-cyan-900/50 bg-transparent text-gray-300',
                    )}
                  >
                    {category.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className='mt-4 flex items-center justify-end gap-3 border-t border-cyan-900/40 pt-4'>
            <button
              type='button'
              onClick={() => onOpenChange(false)}
              className='rounded-xl border border-cyan-900/50 px-4 py-2 text-xs font-semibold text-gray-200'
            >
              Cancelar
            </button>
            <button
              type='button'
              onClick={onApply}
              className='rounded-xl border border-emerald-400/20 bg-emerald-400 px-4 py-2 text-xs font-semibold text-[#062012]'
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
