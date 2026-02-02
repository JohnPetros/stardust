import type { FeedbackReport } from '@stardust/core/reporting/entities'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/shadcn/components/alert-dialog'

export type DeleteFeedbackReportDialogViewProps = {
  report: FeedbackReport | null
  isOpen: boolean
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeleteFeedbackReportDialogView = ({
  report,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteFeedbackReportDialogViewProps) => {
  const authorDto = report?.author.dto.entity

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar feedback</AlertDialogTitle>
          <AlertDialogDescription>
            {report
              ? `Tem certeza que deseja deletar o feedback de ${authorDto?.name ?? 'Anônimo'}?`
              : 'Tem certeza que deseja deletar este feedback?'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className='bg-destructive text-white hover:bg-destructive/90'
            disabled={isDeleting}
          >
            {isDeleting ? 'Deletando...' : 'Deletar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
