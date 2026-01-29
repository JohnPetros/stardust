'use client'

import { useRest } from '@/ui/global/hooks/useRest'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useFeedbackDialog } from './useFeedbackDialog'
import { FeedbackDialogView } from './FeedbackDialogView'

export function FeedbackDialog() {
  const { reportingService, storageService } = useRest()
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
    rawScreenshot,
    isCapturing,
    isCropping,
    isLoading,
    handleSelectIntent,
    handleBack,
    handleReset,
    handleCapture,
    handleCropComplete,
    handleCancelCrop,
    handleDeleteScreenshot,
    handleSubmit,
  } = useFeedbackDialog({
    reportingService,
    storageService,
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
      rawScreenshot={rawScreenshot}
      isCapturing={isCapturing}
      isCropping={isCropping}
      isLoading={isLoading}
      handleSelectIntent={handleSelectIntent}
      handleBack={handleBack}
      handleReset={handleReset}
      handleCapture={handleCapture}
      handleCropComplete={handleCropComplete}
      handleCancelCrop={handleCancelCrop}
      handleDeleteScreenshot={handleDeleteScreenshot}
      handleSubmit={handleSubmit}
    />
  )
}
