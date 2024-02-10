'use server'

import { getCookie } from '@/app/server/actions/getCookie'
import { COOKIES } from '@/utils/constants'
import { checkObject } from '@/utils/helpers'

export type PanelsOffsetType =
  | 'tabs-right;code_editor-left'
  | 'tabs-left;code_editor-right'
  | 'code_editor-full'

export type PanelsOffset = {
  tabsPanelSize: number // percentage
  codeEditorPanelSize: number // percentage
}

const DEFAULT_PANELS_OFFSET: PanelsOffset = {
  codeEditorPanelSize: 50,
  tabsPanelSize: 50,
}

function isPanelsOffset(
  panelsOffset: PanelsOffset
): panelsOffset is PanelsOffset {
  const panelsOffsetProps = Object.keys(DEFAULT_PANELS_OFFSET)
  return checkObject<PanelsOffset>(panelsOffset, panelsOffsetProps)
}

export async function getPanelsOffset(): Promise<PanelsOffset> {
  const storagedPanelsOffset = await getCookie(
    COOKIES.keys.challengePanelsOffset
  )

  if (storagedPanelsOffset) {
    const panelsOffset = JSON.parse(storagedPanelsOffset) as PanelsOffset
    if (isPanelsOffset(panelsOffset)) return panelsOffset
  }

  return DEFAULT_PANELS_OFFSET
}
