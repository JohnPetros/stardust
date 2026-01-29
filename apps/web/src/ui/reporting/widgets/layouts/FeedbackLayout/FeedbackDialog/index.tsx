'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useFeedbackDialog } from './useFeedbackDialog'
import { FeedbackDialogView } from './FeedbackDialogView'

export function FeedbackDialog() {
  const { reportingService } = useRest()
  const { user } = useAuthContext()
  const toast = useToastContext()
  const {
    isOpen,
    handleOpenChange,
    step,
    content,
    setContent,
    intent,
    screenshotPreview,
    isCapturing,
    isLoading,
    handleSelectIntent,
    handleBack,
    handleReset,
    handleCapture,
    handleDeleteScreenshot,
    handleSubmit,
  } = useFeedbackDialog({
    reportingService,
    user,
    toast,
  })

  return (
    <FeedbackDialogView
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      step={step}
      content={content}
      onContentChange={setContent}
      intent={intent}
      screenshotPreview={screenshotPreview}
      isCapturing={isCapturing}
      isLoading={isLoading}
      handleSelectIntent={handleSelectIntent}
      handleBack={handleBack}
      handleReset={handleReset}
      handleCapture={handleCapture}
      handleDeleteScreenshot={handleDeleteScreenshot}
      handleSubmit={handleSubmit}
    />
  )
}
