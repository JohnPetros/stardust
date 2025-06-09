'use client'

import type { PropsWithChildren } from 'react'

import { useSignOutAlertDialog } from './useSignOutAlertDialog'
import { SignOutAlertDialogView } from './SignOutAlertDialogView'

export const SignOutAlertDialog = ({ children }: PropsWithChildren) => {
  const { isSigningOut, handleDialogConfirm } = useSignOutAlertDialog()

  return (
    <SignOutAlertDialogView isSigningOut={isSigningOut} onConfirm={handleDialogConfirm}>
      {children}
    </SignOutAlertDialogView>
  )
}
