import type { ReactNode } from 'react'
import { Integer } from '@stardust/core/global/structures'
import { ChallengeCraftsVisibility } from '@stardust/core/challenging/structures'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { BlockedSolutionsAlertDialogView } from './BlockedSolutionsAlertDialogView'

type Props = {
  children: ReactNode
  onShowSolutions: () => void
}

export const BlockedSolutionsAlertDialog = ({
  children: trigger,
  onShowSolutions,
}: Props) => {
  const { user } = useAuthContext()

  const coins = user?.coins.value ?? 0
  const canAcquireSolutions =
    user?.canAcquire(Integer.create(ChallengeCraftsVisibility.solutionsVisibilityPrice))
      .isTrue ?? false

  return (
    <BlockedSolutionsAlertDialogView
      trigger={trigger}
      coins={coins}
      canAcquireSolutions={canAcquireSolutions}
      onShowSolutions={onShowSolutions}
    />
  )
}
