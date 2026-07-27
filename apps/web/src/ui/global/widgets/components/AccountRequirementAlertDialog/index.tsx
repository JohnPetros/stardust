import type { PropsWithChildren, RefObject } from 'react'

import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import type { AlertDialogRef } from '../AlertDialog/types'
import { AccountRequirementAlertDialogView } from './AccountRequirementAlertDialogView'

type Props = {
  ref?: RefObject<AlertDialogRef | null>
  description: string
}

export const AccountRequirementAlertDialog = ({
  description,
  children,
  ref,
}: PropsWithChildren<Props>) => {
  const { currentRoute } = useNavigationProvider()

  return (
    <AccountRequirementAlertDialogView
      ref={ref}
      description={description}
      nextRoute={currentRoute}
    >
      {children}
    </AccountRequirementAlertDialogView>
  )
}
