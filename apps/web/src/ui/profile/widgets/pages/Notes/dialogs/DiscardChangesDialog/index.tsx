import { DiscardChangesDialogView } from './DiscardChangesDialogView'

type Props = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onConfirm: () => void
}

export const DiscardChangesDialog = ({ ...props }: Props) => {
  return <DiscardChangesDialogView {...props} />
}
