'use client'

import type { ChallengeContent } from '@/ui/challenging/stores/ChallengeStore/types'
import { ChallengeContentNavView } from './ChallengeContentNavView'
import { useChallengeContentNav } from './useChallengeContentNav'

type Props = {
  contents: ChallengeContent[]
}

export const ChallengeContentNav = ({ contents }: Props) => {
  const { craftsVislibility, handleShowSolutions } = useChallengeContentNav()

  return (
    <ChallengeContentNavView
      contents={contents}
      craftsVislibility={craftsVislibility}
      onShowSolutions={handleShowSolutions}
    />
  )
}
