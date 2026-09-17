import type { ReactNode } from 'react'

import { RoadmapHeaderView } from './RoadmapHeaderView'

export function RoadmapHeader({ switchSlot }: { switchSlot: ReactNode }) {
  return <RoadmapHeaderView switchSlot={switchSlot} />
}
