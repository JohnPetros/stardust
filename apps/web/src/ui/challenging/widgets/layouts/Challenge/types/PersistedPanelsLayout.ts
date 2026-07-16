import type {
  DockablePanelId,
  PanelsOffset,
} from '@/ui/challenging/stores/ChallengeStore/types'

export type PersistedPanelsLayout = Partial<PanelsOffset> & {
  panelOrder?: DockablePanelId[]
  panelsLayout?: 'tabs-right;code_editor-left' | 'tabs-left;code_editor-right'
}
