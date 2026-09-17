import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
  type Viewport,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { RoadmapCategoryNode, type RoadmapCategoryNodeData } from './RoadmapCategoryNode'

const nodeTypes = { category: RoadmapCategoryNode }

type Props = {
  nodes: Node<RoadmapCategoryNodeData>[]
  edges: Edge[]
  onMoveEnd: (event: unknown, viewport: Viewport) => void
}

export function RoadmapGraphView({ nodes, edges, onMoveEnd }: Props) {
  return (
    <section
      className='h-[560px] w-full overflow-hidden rounded-lg border border-gray-800 bg-gray-950 md:h-[680px]'
      aria-label='Mapa visual do roadmap'
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        deleteKeyCode={null}
        nodesFocusable
        edgesFocusable={false}
        elementsSelectable
        ariaLabelConfig={{
          'controls.ariaLabel': 'Controles do mapa',
          'controls.zoomIn.ariaLabel': 'Aumentar zoom',
          'controls.zoomOut.ariaLabel': 'Reduzir zoom',
          'controls.fitView.ariaLabel': 'Enquadrar mapa',
          'controls.interactive.ariaLabel': 'Alternar interatividade',
          'node.a11yDescription.default': 'Categoria do roadmap selecionável',
          'node.a11yDescription.keyboardDisabled': 'Categoria do roadmap',
          'edge.a11yDescription.default': 'Conexão entre categorias',
        }}
        onMoveEnd={onMoveEnd}
        proOptions={{ hideAttribution: true }}
        aria-label='Mapa de categorias'
      >
        <Background color='#26302d' gap={24} />
        <Controls
          showInteractive={false}
          position='bottom-left'
          aria-label='Controles do mapa'
        />
      </ReactFlow>
    </section>
  )
}
