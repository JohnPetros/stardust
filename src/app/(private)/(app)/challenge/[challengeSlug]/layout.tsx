import { ReactNode } from 'react'

import { Layout } from './components/Layout'

type ChallengeLayoutProps = {
  children: ReactNode
  tabContent: ReactNode
  codeEditor: ReactNode
}

export default function ChallengeLayout({
  children: header,
  tabContent,
  codeEditor,
}: ChallengeLayoutProps) {
  return (
    <Layout header={header} tabContent={tabContent} codeEditor={codeEditor} />
  )
}
