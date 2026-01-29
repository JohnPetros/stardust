import { useState } from 'react'
import { FeedbackReport } from '@stardust/core/reporting/entities'
import { AuthorAggregate } from '@stardust/core/global/aggregates'
import type { ReportingService } from '@stardust/core/reporting/interfaces'
import type { User } from '@stardust/core/global/entities'
import type { ToastContextValue } from '@/ui/global/contexts/ToastContext/types'

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
  const [isCapturing, setIsCapturing] = useState(false)
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
  }

  async function handleCapture() {
    try {
      setIsCapturing(true)
      await new Promise((resolve) => setTimeout(resolve, 300))

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' } as any,
      })

      const video = document.createElement('video')
      video.srcObject = stream
      await video.play()

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0)

      const base64Image = canvas.toDataURL('image/png')
      setScreenshotPreview(base64Image)

      stream.getTracks().forEach((track) => track.stop())
      setIsCapturing(false)
    } catch {
      console.error('Capture failed')
      setIsCapturing(false)
      toast.showError('Falha ao capturar a tela.')
    }
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

      console.log(response)

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
    setIntent,
    screenshotPreview,
    isCapturing,
    isLoading,
    handleSelectIntent,
    handleBack,
    handleReset,
    handleCapture,
    handleDeleteScreenshot,
    handleSubmit,
  }
}
