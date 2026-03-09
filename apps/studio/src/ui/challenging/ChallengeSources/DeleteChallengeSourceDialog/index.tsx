import type { ReactNode } from 'react'

import { DeleteChallengeSourceDialogView } from './DeleteChallengeSourceDialogView'

type Props = {
  onConfirm: () => void
  children: ReactNode
}

export const DeleteChallengeSourceDialog = ({ onConfirm, children }: Props) => {
  return (
    <DeleteChallengeSourceDialogView onConfirm={onConfirm}>
      {children}
    </DeleteChallengeSourceDialogView>
  )
}
