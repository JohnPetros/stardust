import type {
  DockablePanelId,
  PanelsOffset,
} from '@/ui/challenging/stores/ChallengeStore/types'

export const DEFAULT_PANEL_ORDER: DockablePanelId[] = ['tabs', 'code_editor', 'assistant']

export const DEFAULT_PANELS_OFFSET: PanelsOffset = {
  tabsPanelSize: 38,
  codeEditorPanelSize: 38,
  assistantPanelSize: 24,
}

export const MIN_PANEL_SIZES = {
  tabs: 20,
  codeEditor: 30,
  assistant: 24,
} as const
