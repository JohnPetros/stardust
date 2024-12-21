import type { ReactNode } from 'react'

import { ChallengeLayout } from '@/ui/challenging/widgets/layouts/Challenge'
import { _getPanelsOffset } from '@/ui/app/components/layouts/Challenge/actions'

type ChallengeLayoutProps = {
  children: ReactNode
  tabContent: ReactNode
  codeEditor: ReactNode
}

export async function Layout({
  children: header,
  tabContent,
  codeEditor,
}: ChallengeLayoutProps) {
  const panelsOffset = await _getPanelsOffset()

  return (
    <ChallengeLayout
      header={header}
      tabContent={tabContent}
      codeEditor={codeEditor}
      panelsOffset={panelsOffset}
    />
  )
}
