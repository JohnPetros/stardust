import type { ReactNode } from 'react'

import { ChallengeLayout } from '@/ui/challenging/widgets/layouts/Challenge'
import { parsePanelsLayoutCookie } from '@/ui/challenging/widgets/layouts/Challenge/utils/parsePanelsLayoutCookie'
import { FeedbackLayout } from '@/ui/reporting/widgets/layouts/FeedbackLayout'
import { cookieActions } from '@/rpc/next-safe-action'
import { COOKIES } from '@/constants'

type ChallengeLayoutProps = {
  children: ReactNode
  tabContent: ReactNode
  codeEditor: ReactNode
}

const Layout = async ({
  children: header,
  tabContent,
  codeEditor,
}: ChallengeLayoutProps) => {
  const storagedPanelsOffset = await cookieActions.getCookie(
    COOKIES.keys.challengePanelsOffset,
  )
  const { panelOrder, panelsOffset } = parsePanelsLayoutCookie(storagedPanelsOffset?.data)

  return (
    <FeedbackLayout>
      <ChallengeLayout
        header={header}
        tabContent={tabContent}
        codeEditor={codeEditor}
        panelOrder={panelOrder}
        panelsOffset={panelsOffset}
      />
    </FeedbackLayout>
  )
}

export default Layout
