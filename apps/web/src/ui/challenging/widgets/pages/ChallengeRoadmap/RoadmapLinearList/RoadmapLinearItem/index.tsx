import type { RoadmapNodeWithMeta } from '../../types'
import { RoadmapLinearItemView } from './RoadmapLinearItemView'

export function RoadmapLinearItem(props: {
  node: RoadmapNodeWithMeta
  isSelected: boolean
  isRecommended: boolean
  onSelect: (key: string) => void
}) {
  return <RoadmapLinearItemView {...props} />
}
