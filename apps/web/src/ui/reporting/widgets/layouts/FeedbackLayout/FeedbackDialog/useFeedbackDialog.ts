import { useState } from 'react'
import { toast } from 'sonner'
import { StorageFolder } from '@stardust/core/storage/structures'
import { FeedbackReport } from '@stardust/core/reporting/entities'
import { feedbackReportSchema } from '@stardust/validation/reporting/schemas'
import type { FeedbackIntent } from '@stardust/core/reporting/structures'
import { useRest } from '@/ui/global/hooks/useRest'

export type FeedbackStep = 'initial' | 'form' | 'success' | 'error'

export function useFeedbackDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<FeedbackStep>('initial')
  const [intent, setIntent] = useState<FeedbackIntent['value'] | null>(null)
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)

  const { reportingService, storageService } = useRest()

  const handleSelectIntent = (selectedIntent: FeedbackIntent['value']) => {
    setIntent(selectedIntent)
    setStep('form')
  }

  const handleStartCapture = () => {
    setIsOpen(false)
    setIsCapturing(true)
  }

  const handleFinishCapture = (file: File | null) => {
    setIsCapturing(false)
    if (file) {
      setScreenshotFile(file)
    }
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    if (!intent) return

    setIsSubmitting(true)
    try {
      let screenshotUrl: string | undefined

      if (screenshotFile) {
        const uploadRes = await storageService.uploadFile(
          StorageFolder.createAsFeedback(),
          screenshotFile,
        )

        if (uploadRes.isFailure) throw new Error('Falha no upload')
        // Assuming uploadRes.body contains the url. Adjust if RestResponse differs.
        screenshotUrl = (uploadRes.body as any).url
      }

      const reportData = {
        content,
        intent,
        screenshot: screenshotUrl,
        author: {
          id: '',
        },
      }

      const validation = feedbackReportSchema.safeParse(reportData)
      if (!validation.success) {
        console.error(validation.error)
        toast.error('Verifique os dados preenchidos')
        setIsSubmitting(false)
        return
      }

      const feedbackReport = FeedbackReport.create(reportData)
      const response = await reportingService.sendFeedbackReport(feedbackReport)

      if (response.isSuccessful) {
        setStep('success')
        setContent('')
        setScreenshotFile(null)
      } else {
        setStep('error')
      }
    } catch (e) {
      console.error(e)
      setStep('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const reset = () => {
    setStep('initial')
    setIntent(null)
    setContent('')
    setScreenshotFile(null)
    setIsCapturing(false)
  }

  return {
    isOpen,
    setIsOpen,
    step,
    setStep,
    intent,
    handleSelectIntent,
    content,
    setContent,
    screenshotFile,
    setScreenshotFile,
    isSubmitting,
    isCapturing,
    handleStartCapture,
    handleFinishCapture,
    handleSubmit,
    reset,
  }
}
