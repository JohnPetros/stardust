import type { PropsWithChildren, RefObject } from 'react'

import { ROUTES } from '@/constants'
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
  const { currentRoute, goTo } = useNavigationProvider()

  function handleConfirm() {
    const query = new URLSearchParams({ nextRoute: currentRoute })
    goTo(`${ROUTES.auth.signIn}?${query.toString()}`)
  }

  return (
    <AccountRequirementAlertDialogView
      ref={ref}
      description={description}
      onConfirm={handleConfirm}
    >
      {children}
    </AccountRequirementAlertDialogView>
  )
}
