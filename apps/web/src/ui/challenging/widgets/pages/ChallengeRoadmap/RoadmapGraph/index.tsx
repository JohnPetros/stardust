'use client'

import { ReactFlowProvider, type Edge, type Node, type Viewport } from '@xyflow/react'
import type { RoadmapNodeDto } from '@stardust/core/challenging/structures/dtos'
import { RoadmapGraphView } from './RoadmapGraphView'
import { useRoadmapGraph } from './useRoadmapGraph'
import type { RoadmapCategoryNodeData } from './RoadmapCategoryNode'

type Props = {
  nodes: Node<RoadmapCategoryNodeData>[]
  edges: Edge[]
  storage: { get: () => Viewport | null; set: (value: Viewport) => void }
}

function RoadmapGraphContent({ nodes, edges, storage }: Props) {
  const graph = useRoadmapGraph({ storage })
  return <RoadmapGraphView nodes={nodes} edges={edges} onMoveEnd={graph.onMoveEnd} />
}

export function RoadmapGraph(props: Props) {
  return (
    <ReactFlowProvider>
      <RoadmapGraphContent {...props} />
    </ReactFlowProvider>
  )
}

export type { RoadmapNodeDto }
