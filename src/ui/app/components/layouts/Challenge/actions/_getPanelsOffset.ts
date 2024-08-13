'use server'

import type { PanelsOffset } from '../types'
import { COOKIES } from '@/ui/global/constants'
import { _getCookie } from '@/ui/global/actions'

const DEFAULT_PANELS_OFFSET: PanelsOffset = {
  codeEditorPanelSize: 50,
  tabsPanelSize: 50,
}

export async function _getPanelsOffset(): Promise<PanelsOffset> {
  const storagedPanelsOffset = await _getCookie(COOKIES.keys.challengePanelsOffset)

  if (storagedPanelsOffset) {
    const panelsOffset = JSON.parse(storagedPanelsOffset) as PanelsOffset
    return panelsOffset
  }

  return DEFAULT_PANELS_OFFSET
}
