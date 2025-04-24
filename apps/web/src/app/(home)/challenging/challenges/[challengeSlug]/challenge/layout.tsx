import type { ReactNode } from 'react'

import { ChallengeLayout } from '@/ui/challenging/widgets/layouts/Challenge'
import type { PanelsOffset } from '@/ui/challenging/widgets/layouts/Challenge/types'
import { cookieActions } from '@/rpc/next-safe-action'
import { COOKIES } from '@/constants'

const DEFAULT_PANELS_OFFSET: PanelsOffset = {
  codeEditorPanelSize: 50,
  tabsPanelSize: 50,
}

type ChallengeLayoutProps = {
  children: ReactNode
  tabContent: ReactNode
  codeEditor: ReactNode
}

export default async function Layout({
  children: header,
  tabContent,
  codeEditor,
}: ChallengeLayoutProps) {
  const storagedPanelsOffset = await cookieActions.getCookie(
    COOKIES.keys.challengePanelsOffset,
  )
  let panelsOffset: PanelsOffset

  if (storagedPanelsOffset?.data) {
    panelsOffset = JSON.parse(storagedPanelsOffset.data) as PanelsOffset
  } else {
    panelsOffset = DEFAULT_PANELS_OFFSET
  }

  return (
    <ChallengeLayout
      header={header}
      tabContent={tabContent}
      codeEditor={codeEditor}
      panelsOffset={panelsOffset}
    />
  )
}
