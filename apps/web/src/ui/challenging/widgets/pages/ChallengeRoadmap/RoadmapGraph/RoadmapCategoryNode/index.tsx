import type { NodeProps } from '@xyflow/react'
import type { RoadmapNodeDto } from '@stardust/core/challenging/structures/dtos'
import { RoadmapCategoryNodeView } from './RoadmapCategoryNodeView'

export type RoadmapCategoryNodeData = {
  node: RoadmapNodeDto
  isSelected: boolean
  isRecommended: boolean
  onSelect: (key: string) => void
}

export function RoadmapCategoryNode({
  data,
}: NodeProps & { data: RoadmapCategoryNodeData }) {
  return (
    <RoadmapCategoryNodeView
      node={data.node}
      isSelected={data.isSelected}
      isRecommended={data.isRecommended}
      onSelect={data.onSelect}
    />
  )
}
