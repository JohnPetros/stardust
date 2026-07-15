import type { DockablePanelId } from '@/ui/challenging/stores/ChallengeStore/types'

const MIN_DIRECTIONAL_DRAG_DISTANCE = 40

export function getDirectionalDropPanelId(
  visiblePanelOrder: DockablePanelId[],
  activePanelId: DockablePanelId,
  deltaX: number,
) {
  if (Math.abs(deltaX) < MIN_DIRECTIONAL_DRAG_DISTANCE) return null

  const activePanelIndex = visiblePanelOrder.indexOf(activePanelId)
  if (activePanelIndex < 0) return null

  const targetPanelIndex = deltaX > 0 ? activePanelIndex + 1 : activePanelIndex - 1

  return visiblePanelOrder[targetPanelIndex] ?? null
}
