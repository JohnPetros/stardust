import type { DockablePanelId } from '@/ui/challenging/stores/ChallengeStore/types'
import { DEFAULT_PANEL_ORDER } from '../constants/panel-layout'

function normalizePanelOrder(panelOrder: DockablePanelId[]) {
  const knownPanelIds = new Set<DockablePanelId>(DEFAULT_PANEL_ORDER)
  const normalizedPanelOrder = panelOrder.filter((panelId, index, panelIds) => {
    return knownPanelIds.has(panelId) && panelIds.indexOf(panelId) === index
  })

  for (const panelId of DEFAULT_PANEL_ORDER) {
    if (!normalizedPanelOrder.includes(panelId)) normalizedPanelOrder.push(panelId)
  }

  return normalizedPanelOrder
}

export function reorderDockablePanels(
  panelOrder: DockablePanelId[],
  activePanelId: DockablePanelId,
  overPanelId: DockablePanelId,
) {
  const normalizedPanelOrder = normalizePanelOrder(panelOrder)
  const activePanelIndex = normalizedPanelOrder.indexOf(activePanelId)
  const overPanelIndex = normalizedPanelOrder.indexOf(overPanelId)

  if (activePanelIndex < 0 || overPanelIndex < 0 || activePanelIndex === overPanelIndex) {
    return normalizedPanelOrder
  }

  const reorderedPanelOrder = [...normalizedPanelOrder]
  const [activePanel] = reorderedPanelOrder.splice(activePanelIndex, 1)

  reorderedPanelOrder.splice(overPanelIndex, 0, activePanel)

  return reorderedPanelOrder
}
