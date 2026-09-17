import type { ChallengeRoadmapDto } from '@stardust/core/challenging/structures/dtos'
import { ChallengesViewSwitch } from '../../components/ChallengesViewSwitch'
import { RoadmapHeader } from './RoadmapHeader'
import { RoadmapProgressSummary } from './RoadmapProgressSummary'
import { RoadmapGraph } from './RoadmapGraph'
import { RoadmapLinearList } from './RoadmapLinearList'
import { RoadmapChallengeDrawer } from './RoadmapChallengeDrawer'
import { RoadmapStateMessage } from './RoadmapStateMessage'
import type { RoadmapNodeWithMeta } from './types'
import type { ChallengeRoadmapHookParams } from './useChallengeRoadmap'

type Props = ReturnType<typeof import('./useChallengeRoadmap').useChallengeRoadmap> &
  Pick<ChallengeRoadmapHookParams, 'service' | 'analytics'>

export function ChallengeRoadmapPageView({
  roadmap,
  nodes,
  graphNodes,
  graphEdges,
  selectedNode,
  selectedNodeKey,
  error,
  isLoading,
  viewMode,
  setViewMode,
  revalidate,
  selectNode,
  closeNode,
  continueChallenge,
  openChallenge,
  viewportStorage,
  isAuthenticated,
  service,
  analytics,
}: Props) {
  if (error && !roadmap)
    return (
      <main className='mx-auto max-w-6xl px-5 py-8'>
        <RoadmapStateMessage variant='error' message={error} onAction={revalidate} />
      </main>
    )
  if (!roadmap)
    return (
      <main className='mx-auto max-w-6xl px-5 py-8'>
        <div role='status' aria-live='polite' className='space-y-5'>
          <div className='h-20 animate-pulse rounded bg-gray-800' />
          <div className='h-10 w-72 animate-pulse rounded bg-gray-800' />
          <div className='h-96 animate-pulse rounded bg-gray-900' />
        </div>
      </main>
    )
  if (roadmap.nodes.length === 0)
    return (
      <main className='mx-auto max-w-6xl space-y-6 px-5 py-8'>
        <RoadmapHeader switchSlot={<ChallengesViewSwitch activeView='roadmap' />} />
        <RoadmapStateMessage variant='empty' />
      </main>
    )
  return (
    <main className='mx-auto max-w-7xl space-y-6 px-5 py-8 pb-20'>
      <RoadmapHeader switchSlot={<ChallengesViewSwitch activeView='roadmap' />} />
      <div className='flex items-center justify-between gap-3 md:hidden'>
        <fieldset
          className='flex rounded border border-gray-700 p-1'
          aria-label='Modo de visualização'
        >
          <button
            type='button'
            aria-pressed={viewMode === 'list'}
            onClick={() => setViewMode('list')}
            className={`min-h-11 px-3 text-sm ${viewMode === 'list' ? 'bg-green-400 text-gray-950' : 'text-gray-300'}`}
          >
            Lista
          </button>
          <button
            type='button'
            aria-pressed={viewMode === 'map'}
            onClick={() => setViewMode('map')}
            className={`min-h-11 px-3 text-sm ${viewMode === 'map' ? 'bg-green-400 text-gray-950' : 'text-gray-300'}`}
          >
            Mapa
          </button>
        </fieldset>
        {isLoading && (
          <span role='status' className='text-xs text-gray-400'>
            Atualizando…
          </span>
        )}
      </div>
      <div className='grid gap-6 lg:grid-cols-[1fr_322px]'>
        <div className={`${viewMode === 'list' ? 'hidden md:block' : ''}`}>
          <RoadmapGraph nodes={graphNodes} edges={graphEdges} storage={viewportStorage} />
          <div className='mt-4 hidden md:block'>
            <p className='mb-2 text-xs text-gray-500'>
              Use Tab para navegar pelas categorias. O mapa é somente leitura.
            </p>
            <RoadmapLinearList
              nodes={nodes}
              selectedNodeKey={selectedNodeKey}
              recommendationNodeKey={roadmap.recommendation?.nodeKey ?? null}
              onSelect={selectNode}
            />
          </div>
        </div>
        <div className={viewMode === 'map' ? 'hidden md:block' : 'block'}>
          <RoadmapProgressSummary
            progress={roadmap.progress}
            recommendation={roadmap.recommendation}
            isAuthenticated={isAuthenticated}
            onContinue={continueChallenge}
          />
          <div className='mt-4 md:hidden'>
            <RoadmapLinearList
              nodes={nodes}
              selectedNodeKey={selectedNodeKey}
              recommendationNodeKey={roadmap.recommendation?.nodeKey ?? null}
              onSelect={selectNode}
            />
          </div>
        </div>
      </div>
      <RoadmapChallengeDrawer
        isOpen={Boolean(selectedNode)}
        node={selectedNode}
        service={service}
        analytics={analytics}
        revisionKey={roadmap.revision.key}
        recommendationId={roadmap.recommendation?.challengeId}
        onClose={closeNode}
        onOpenChallenge={openChallenge}
      />
    </main>
  )
}

export type { RoadmapNodeWithMeta, ChallengeRoadmapDto }
