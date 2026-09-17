import type { RoadmapNodeDto } from '@stardust/core/challenging/structures/dtos'
import { Handle, Position } from '@xyflow/react'

type Props = {
  node: RoadmapNodeDto
  isSelected: boolean
  isRecommended: boolean
  onSelect: (key: string) => void
}

export function RoadmapCategoryNodeView({
  node,
  isSelected,
  isRecommended,
  onSelect,
}: Props) {
  const completed = node.completedChallenges
  const percentage =
    completed === null || !node.totalChallenges
      ? null
      : Math.round((completed / node.totalChallenges) * 100)
  const isComingSoon = node.state === 'comingSoon'
  const progressLabel =
    completed === null
      ? `${node.totalChallenges} desafios editoriais`
      : `${completed} de ${node.totalChallenges} concluídos`
  return (
    <button
      type='button'
      data-roadmap-node={node.key}
      aria-label={`${node.category.name}, ${isComingSoon ? 'Em breve' : progressLabel}${node.isEligible === false ? ', pré-requisitos pendentes' : ''}`}
      aria-pressed={isSelected}
      onClick={() => onSelect(node.key)}
      className={`relative h-[76px] w-[190px] rounded-lg border p-3 text-left transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400 ${isSelected ? 'border-green-400 bg-green-950/60' : 'border-gray-600 bg-gray-900 hover:border-green-500'} ${isComingSoon ? 'opacity-75' : ''}`}
    >
      <Handle id='target' type='target' position={Position.Left} aria-hidden='true' />
      <Handle id='source' type='source' position={Position.Right} aria-hidden='true' />
      <span className='flex items-center justify-between gap-2'>
        <span className='truncate text-sm font-semibold text-gray-100'>
          {node.category.name}
        </span>
        {!isComingSoon && isRecommended ? (
          <span className='text-[10px] uppercase text-green-400'>Recomendado</span>
        ) : null}
      </span>
      {isComingSoon ? (
        <span className='mt-1 block text-xs text-gray-400'>Em breve · detalhes</span>
      ) : (
        <>
          {percentage === null ? null : (
            <span className='mt-2 block h-1.5 overflow-hidden rounded-full bg-gray-700'>
              <span
                className='block h-full rounded-full bg-green-400'
                style={{ width: `${percentage}%` }}
              />
            </span>
          )}
          <span className='mt-1 block font-mono text-[10px] text-gray-400'>
            {progressLabel}
          </span>
        </>
      )}
    </button>
  )
}
