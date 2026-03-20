import type { ReactNode } from 'react'
import { BlockedCommentsAlertDialogView } from './BlockedCommentsAlertDialogView'

type Props = {
  children: ReactNode
}

export const BlockedCommentsAlertDialog = ({ children: trigger }: Props) => {
  return <BlockedCommentsAlertDialogView trigger={trigger} />
}
