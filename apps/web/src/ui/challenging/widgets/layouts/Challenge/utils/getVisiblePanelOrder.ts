import type { DockablePanelId } from '@/ui/challenging/stores/ChallengeStore/types'
import { DEFAULT_PANEL_ORDER } from '../constants/panel-layout'

export function getVisiblePanelOrder(
  panelOrder: DockablePanelId[],
  isAssistantEnabled: boolean,
) {
  const normalizedPanelOrder = panelOrder.filter((panelId, index, panelIds) => {
    return DEFAULT_PANEL_ORDER.includes(panelId) && panelIds.indexOf(panelId) === index
  })

  for (const panelId of DEFAULT_PANEL_ORDER) {
    if (!normalizedPanelOrder.includes(panelId)) normalizedPanelOrder.push(panelId)
  }

  if (isAssistantEnabled) return normalizedPanelOrder

  return normalizedPanelOrder.filter((panelId) => panelId !== 'assistant')
}
