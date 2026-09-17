import type { RoadmapNodeDto } from '@stardust/core/challenging/structures/dtos'
import type { RoadmapChallengeDto } from '../types'
import { RoadmapDrawerHeader } from './RoadmapDrawerHeader'
import { RoadmapDrawerFilters } from './RoadmapDrawerFilters'
import { RoadmapChallengeList } from './RoadmapChallengeList'
import { RoadmapStateMessage } from '../RoadmapStateMessage'

type Props = {
  node: RoadmapNodeDto
  challenges: RoadmapChallengeDto[]
  filteredChallenges: RoadmapChallengeDto[]
  isLoading: boolean
  error: string | null
  recommendationId?: string
  drawerRef: React.RefObject<HTMLDivElement | null>
  onClose: () => void
  onRetry: () => void
  onFiltersChange: (challenges: RoadmapChallengeDto[]) => void
  onOpenChallenge: (challenge: RoadmapChallengeDto) => void
}

export function RoadmapChallengeDrawerView({
  node,
  challenges,
  filteredChallenges,
  isLoading,
  error,
  recommendationId,
  drawerRef,
  onClose,
  onRetry,
  onFiltersChange,
  onOpenChallenge,
}: Props) {
  return (
    <>
      <button
        type='button'
        aria-label='Fechar drawer'
        onClick={onClose}
        className='fixed inset-0 z-30 cursor-default bg-gray-950/70'
      />
      <aside
        ref={drawerRef}
        tabIndex={-1}
        role='dialog'
        aria-modal='true'
        aria-labelledby='roadmap-drawer-title'
        className='fixed inset-y-0 right-0 z-40 w-full max-w-[500px] overflow-y-auto border-l border-gray-700 bg-gray-900 p-6 shadow-2xl focus-visible:outline-none md:m-4 md:max-h-[calc(100vh-2rem)] md:rounded-lg md:p-7'
      >
        <RoadmapDrawerHeader
          title={node.category.name}
          description='Desafios selecionados para esta etapa.'
          completed={node.completedChallenges}
          total={node.totalChallenges}
          onClose={onClose}
        />
        {node.state === 'comingSoon' ? (
          <RoadmapStateMessage variant='comingSoon' />
        ) : isLoading && challenges.length === 0 ? (
          <div
            role='status'
            aria-live='polite'
            className='py-12 text-center text-sm text-gray-400'
          >
            Carregando desafios…
          </div>
        ) : error ? (
          <RoadmapStateMessage variant='error' message={error} onAction={onRetry} />
        ) : (
          <>
            <RoadmapDrawerFilters
              challenges={challenges}
              onFiltersChange={onFiltersChange}
            />
            <RoadmapChallengeList
              challenges={filteredChallenges}
              nodeKey={node.key}
              recommendationId={recommendationId}
              onOpen={onOpenChallenge}
            />
          </>
        )}
      </aside>
    </>
  )
}
