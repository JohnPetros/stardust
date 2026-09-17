import type { CompletionFilter, DifficultyFilter } from './useRoadmapDrawerFilters'

type Props = {
  query: string
  difficulty: DifficultyFilter
  completion: CompletionFilter
  onQueryChange: (value: string) => void
  onDifficultyChange: (value: DifficultyFilter) => void
  onCompletionChange: (value: CompletionFilter) => void
}

export function RoadmapDrawerFiltersView({
  query,
  difficulty,
  completion,
  onQueryChange,
  onDifficultyChange,
  onCompletionChange,
}: Props) {
  return (
    <div className='space-y-3 py-5'>
      <label className='block text-sm text-gray-300' htmlFor='roadmap-search'>
        Buscar desafio
        <input
          id='roadmap-search'
          type='search'
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder='Pesquisar por título...'
          className='mt-2 h-11 w-full rounded border border-gray-600 bg-gray-800 px-3 text-sm text-gray-100 outline-none focus:border-green-400'
        />
      </label>
      <div className='grid grid-cols-2 gap-3'>
        <label className='text-sm text-gray-300' htmlFor='roadmap-difficulty'>
          Dificuldade
          <select
            id='roadmap-difficulty'
            value={difficulty}
            onChange={(event) =>
              onDifficultyChange(event.target.value as DifficultyFilter)
            }
            className='mt-2 h-11 w-full rounded border border-gray-600 bg-gray-800 px-2 text-sm text-gray-100'
          >
            <option value='all'>Todas</option>
            <option value='easy'>Fácil</option>
            <option value='medium'>Médio</option>
            <option value='hard'>Difícil</option>
          </select>
        </label>
        <label className='text-sm text-gray-300' htmlFor='roadmap-completion'>
          Conclusão
          <select
            id='roadmap-completion'
            value={completion}
            onChange={(event) =>
              onCompletionChange(event.target.value as CompletionFilter)
            }
            className='mt-2 h-11 w-full rounded border border-gray-600 bg-gray-800 px-2 text-sm text-gray-100'
          >
            <option value='all'>Todos</option>
            <option value='completed'>Concluídos</option>
            <option value='pending'>Pendentes</option>
          </select>
        </label>
      </div>
    </div>
  )
}
