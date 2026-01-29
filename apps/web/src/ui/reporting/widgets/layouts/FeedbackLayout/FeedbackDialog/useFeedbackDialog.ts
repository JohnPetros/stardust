import { useState } from 'react'
import { FeedbackReport } from '@stardust/core/reporting/entities'
import { AuthorAggregate } from '@stardust/core/global/aggregates'
import type { ReportingService } from '@stardust/core/reporting/interfaces'
import type { User } from '@stardust/core/global/entities'
import type { ToastContextValue } from '@/ui/global/contexts/ToastContext/types'
import html2canvas from 'html2canvas'

export type FeedbackStep = 'initial' | 'form' | 'success'

type Params = {
  reportingService: ReportingService
  user: User | null
  toast: ToastContextValue
}

export function useFeedbackDialog({ reportingService, user, toast }: Params) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<FeedbackStep>('initial')
  const [content, setContent] = useState('')
  const [intent, setIntent] = useState<string>('idea')
  const [screenshotPreview, setScreenshotPreview] = useState<string | undefined>()
  const [rawScreenshot, setRawScreenshot] = useState<string | undefined>()
  const [isCapturing, setIsCapturing] = useState(false)
  const [isCropping, setIsCropping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function handleOpenChange(open: boolean) {
    setIsOpen(open)
    if (!open) {
      // Small delay to reset after transition
      setTimeout(() => {
        setStep('initial')
        setContent('')
        setIntent('idea')
        setScreenshotPreview(undefined)
        setRawScreenshot(undefined)
        setIsCropping(false)
      }, 300)
    }
  }

  function handleSelectIntent(selectedIntent: string) {
    setIntent(selectedIntent)
    setStep('form')
  }

  function handleBack() {
    setStep('initial')
  }

  function handleReset() {
    setStep('initial')
    setContent('')
    setIntent('idea')
    setScreenshotPreview(undefined)
    setRawScreenshot(undefined)
    setIsCropping(false)
  }

  async function handleCapture() {
    try {
      setIsCapturing(true)

      // Wait for dialog to close
      await new Promise((resolve) => setTimeout(resolve, 300))

      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#121214', // Default background color
      })

      const base64Image = canvas.toDataURL('image/png')
      setRawScreenshot(base64Image)
      setIsCropping(true)
      setIsCapturing(false)
    } catch (error) {
      console.error('Capture failed', error)
      setIsCapturing(false)
      toast.showError('Falha ao capturar a tela.')
    }
  }

  function handleCropComplete(croppedImage: string) {
    setScreenshotPreview(croppedImage)
    setIsCropping(false)
    setRawScreenshot(undefined)
  }

  function handleCancelCrop() {
    setIsCropping(false)
    setRawScreenshot(undefined)
  }

  function handleDeleteScreenshot() {
    setScreenshotPreview(undefined)
  }

  async function handleSubmit() {
    if (!content.trim()) {
      toast.showError('Por favor, descreva seu feedback.')
      return
    }

    if (!user) {
      toast.showError('Você precisa estar logado para enviar feedback.')
      return
    }

    setIsLoading(true)
    try {
      const author = AuthorAggregate.create({
        id: user.id.value,
        entity: {
          name: user.name.value,
          slug: user.slug.value,
          avatar: {
            name: user.avatar.name.value,
            image: user.avatar.image.value,
          },
        },
      })

      const feedbackReport = FeedbackReport.create({
        content,
        intent,
        author: author.dto,
        screenshot: screenshotPreview,
        sentAt: new Date().toISOString(),
      })

      const response = await reportingService.sendFeedbackReport(feedbackReport)

      if (response.isSuccessful) {
        setStep('success')
        toast.showSuccess('Feedback enviado com sucesso! Obrigado.')
      } else {
        toast.showError(response.errorMessage || 'Falha ao enviar feedback.')
      }
    } catch {
      toast.showError('Erro inesperado ao enviar feedback.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
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
  }
}
