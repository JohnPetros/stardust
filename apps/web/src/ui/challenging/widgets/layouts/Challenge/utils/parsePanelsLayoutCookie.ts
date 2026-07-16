import type {
  DockablePanelId,
  PanelsOffset,
} from '@/ui/challenging/stores/ChallengeStore/types'
import type { PersistedPanelsLayout } from '../types'
import { DEFAULT_PANEL_ORDER, DEFAULT_PANELS_OFFSET } from '../constants/panel-layout'

type ParsedPanelsLayout = {
  panelOrder: DockablePanelId[]
  panelsOffset: PanelsOffset
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : fallback
}

function parsePanelOrder(
  value: unknown,
  legacyLayout?: PersistedPanelsLayout['panelsLayout'],
) {
  if (Array.isArray(value)) {
    const parsedPanelOrder = value.filter(
      (panelId, index, panelIds): panelId is DockablePanelId =>
        DEFAULT_PANEL_ORDER.includes(panelId) && panelIds.indexOf(panelId) === index,
    )

    for (const panelId of DEFAULT_PANEL_ORDER) {
      if (!parsedPanelOrder.includes(panelId)) parsedPanelOrder.push(panelId)
    }

    return parsedPanelOrder
  }

  if (legacyLayout === 'tabs-right;code_editor-left') {
    return ['code_editor', 'tabs', 'assistant'] satisfies DockablePanelId[]
  }

  return DEFAULT_PANEL_ORDER
}

export function parsePanelsLayoutCookie(
  value: string | null | undefined,
): ParsedPanelsLayout {
  if (!value) {
    return {
      panelOrder: DEFAULT_PANEL_ORDER,
      panelsOffset: DEFAULT_PANELS_OFFSET,
    }
  }

  try {
    const parsedValue: unknown = JSON.parse(value)

    if (!isRecord(parsedValue)) {
      return {
        panelOrder: DEFAULT_PANEL_ORDER,
        panelsOffset: DEFAULT_PANELS_OFFSET,
      }
    }

    const persistedLayout = parsedValue as PersistedPanelsLayout

    return {
      panelOrder: parsePanelOrder(
        persistedLayout.panelOrder,
        persistedLayout.panelsLayout,
      ),
      panelsOffset: {
        tabsPanelSize: parseNumber(
          persistedLayout.tabsPanelSize,
          DEFAULT_PANELS_OFFSET.tabsPanelSize,
        ),
        codeEditorPanelSize: parseNumber(
          persistedLayout.codeEditorPanelSize,
          DEFAULT_PANELS_OFFSET.codeEditorPanelSize,
        ),
        assistantPanelSize: parseNumber(
          persistedLayout.assistantPanelSize,
          DEFAULT_PANELS_OFFSET.assistantPanelSize,
        ),
      },
    }
  } catch {
    return {
      panelOrder: DEFAULT_PANEL_ORDER,
      panelsOffset: DEFAULT_PANELS_OFFSET,
    }
  }
}
