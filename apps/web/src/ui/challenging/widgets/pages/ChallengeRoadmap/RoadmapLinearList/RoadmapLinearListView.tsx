import type { RoadmapNodeWithMeta } from '../types'
import { RoadmapLinearItem } from './RoadmapLinearItem'

type Props = {
  nodes: RoadmapNodeWithMeta[]
  selectedNodeKey: string | null
  recommendationNodeKey: string | null
  onSelect: (key: string) => void
}

export function RoadmapLinearListView({
  nodes,
  selectedNodeKey,
  recommendationNodeKey,
  onSelect,
}: Props) {
  return (
    <ol aria-label='Roadmap em ordem de aprendizado' className='space-y-3'>
      {nodes.map((node) => (
        <RoadmapLinearItem
          key={node.key}
          node={node}
          isSelected={node.key === selectedNodeKey}
          isRecommended={node.key === recommendationNodeKey}
          onSelect={onSelect}
        />
      ))}
    </ol>
  )
}
