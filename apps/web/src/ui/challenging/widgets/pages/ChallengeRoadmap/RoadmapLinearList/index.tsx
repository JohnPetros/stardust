import type { RoadmapNodeWithMeta } from '../types'
import { RoadmapLinearListView } from './RoadmapLinearListView'

export function RoadmapLinearList(props: {
  nodes: RoadmapNodeWithMeta[]
  selectedNodeKey: string | null
  recommendationNodeKey: string | null
  onSelect: (key: string) => void
}) {
  return <RoadmapLinearListView {...props} />
}
