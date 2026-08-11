'use client'

import { usePathname } from 'next/navigation'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { FeedbackDialogView } from './FeedbackDialogView'
import { useFeedbackDialogController } from './useFeedbackDialogController'
import { useFeedbackDialogHeader } from './useFeedbackDialogHeader'

export function FeedbackDialog() {
  const { reportingService, signedFileStorageProvider } = useRestContext()
  const { user } = useAuthContext()
  const toast = useToastContext()
  const pathname = usePathname()
  const controller = useFeedbackDialogController({
    reportingService,
    signedFileStorageProvider,
    user,
    toast,
    pathname,
  })
  const { currentIntent } = useFeedbackDialogHeader({ intent: controller.intent })

  return <FeedbackDialogView {...controller} currentIntent={currentIntent} />
}
