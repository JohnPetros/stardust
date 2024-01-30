import { ReactNode } from 'react'

import { getPanelsOffset } from './actions/getPanelsOffset'
import { Layout } from './components/Layout'

type ChallengeLayoutProps = {
  children: ReactNode
  tabContent: ReactNode
  codeEditor: ReactNode
}

export default async function ChallengeLayout({
  children: header,
  tabContent,
  codeEditor,
}: ChallengeLayoutProps) {
  const panelsOffset = await getPanelsOffset()

  return (
    <Layout
      header={header}
      tabContent={tabContent}
      codeEditor={codeEditor}
      panelsOffset={panelsOffset}
    />
  )
}
