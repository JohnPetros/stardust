'use client'

import type { ChallengeContent } from '@/ui/challenging/stores/ChallengeStore/types'
import { useDockablePanelDragHandle } from '../../layouts/Challenge/DockablePanel/DockablePanelDragHandleContext'
import { ChallengeContentNavView } from './ChallengeContentNavView'
import { useChallengeContentNav } from './useChallengeContentNav'

type Props = {
  contents: ChallengeContent[]
}

export const ChallengeContentNav = ({ contents }: Props) => {
  const dragHandle = useDockablePanelDragHandle()
  const { craftsVislibility, handleShowSolutions } = useChallengeContentNav()

  return (
    <ChallengeContentNavView
      contents={contents}
      craftsVislibility={craftsVislibility}
      onShowSolutions={handleShowSolutions}
      dragHandle={dragHandle}
    />
  )
}
