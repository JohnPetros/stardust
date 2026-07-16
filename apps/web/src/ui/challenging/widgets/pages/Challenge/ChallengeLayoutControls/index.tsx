import type { DockablePanelId } from '@/ui/challenging/stores/ChallengeStore/types'
import { ChallengeLayoutControlsView } from './ChallengeLayoutControlsView'

type Props = {
  panelOrder: DockablePanelId[]
  onResetLayout: () => void
}

export const ChallengeLayoutControls = ({ panelOrder, onResetLayout }: Props) => {
  return (
    <ChallengeLayoutControlsView panelOrder={panelOrder} onResetLayout={onResetLayout} />
  )
}
