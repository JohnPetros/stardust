import type { RoadmapNodeWithMeta } from '../../types'

type Props = {
  node: RoadmapNodeWithMeta
  isSelected: boolean
  isRecommended: boolean
  onSelect: (key: string) => void
}

export function RoadmapLinearItemView({ node, isSelected, isRecommended, onSelect }: Props) {
  const completed = node.completedChallenges
  const progressLabel =
    completed === null
      ? `${node.totalChallenges} desafios editoriais`
      : `${completed} de ${node.totalChallenges} concluídos`
  const recommendationLabel = isRecommended ? '. Recomendado para continuar' : ''
  const label = `${node.category.name}: ${node.state === 'comingSoon' ? 'Em breve' : progressLabel}${recommendationLabel}${node.prerequisiteKeys.length ? `. Pré-requisitos: ${node.prerequisiteKeys.join(', ')}` : ''}`
  return (
    <li>
      <button
        type='button'
        data-roadmap-node={node.key}
        aria-pressed={isSelected}
        aria-label={label}
        onClick={() => onSelect(node.key)}
        className={`min-h-16 w-full rounded-lg border p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400 motion-reduce:transition-none ${isSelected ? 'border-green-400 bg-green-950/40' : 'border-gray-700 bg-gray-900'}`}
      >
        <span className='flex items-center justify-between gap-3'>
          <strong className='text-gray-100'>{node.category.name}</strong>
          {isRecommended ? (
            <span className='text-xs text-green-400'>Recomendado</span>
          ) : null}
          <span className='font-mono text-xs text-gray-400'>
            {node.state === 'comingSoon'
              ? 'Em breve'
              : completed === null
                ? `${node.totalChallenges} desafios`
                : `${completed}/${node.totalChallenges}`}
          </span>
        </span>
        {node.prerequisiteKeys.length > 0 && (
          <span className='mt-1 block text-xs text-gray-500'>
            Pré-requisitos: {node.prerequisiteKeys.join(', ')}
          </span>
        )}
      </button>
    </li>
  )
}
