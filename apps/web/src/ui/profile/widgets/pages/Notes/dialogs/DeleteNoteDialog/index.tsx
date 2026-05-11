import { DeleteNoteDialogView } from './DeleteNoteDialogView'

type Props = {
  isOpen: boolean
  isDeleting: boolean
  onOpenChange: (isOpen: boolean) => void
  onConfirm: () => Promise<boolean>
}

export const DeleteNoteDialog = ({ ...props }: Props) => {
  return <DeleteNoteDialogView {...props} />
}
