import { ReactNode } from 'react'

import { getPanelsOffset } from './actions/getPanelsOffset'
import { ChallengeLayout } from './components/Layout'

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
  const panelsOffset = await getPanelsOffset()

  return (
    <ChallengeLayout
      header={header}
      tabContent={tabContent}
      codeEditor={codeEditor}
      panelsOffset={panelsOffset}
    />
  )
}
