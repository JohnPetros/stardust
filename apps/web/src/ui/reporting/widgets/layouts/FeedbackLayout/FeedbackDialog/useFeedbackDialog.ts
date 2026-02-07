import { useState } from 'react'
import { FeedbackReport } from '@stardust/core/reporting/entities'
import { AuthorAggregate } from '@stardust/core/global/aggregates'
import type { ReportingService } from '@stardust/core/reporting/interfaces'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { StorageFolder } from '@stardust/core/storage/structures'
import type { User } from '@stardust/core/global/entities'
import type { ToastContextValue } from '@/ui/global/contexts/ToastContext/types'
import { domToPng } from 'modern-screenshot'

export type FeedbackStep = 'initial' | 'form' | 'success'

type Params = {
  reportingService: ReportingService
  storageService: StorageService
  user: User | null
  toast: ToastContextValue
}

export function useFeedbackDialog({
  reportingService,
  storageService,
  user,
  toast,
}: Params) {
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
    if (!open && !isCapturing && !isCropping) {
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
    const feedbackButton = document.querySelector(
      'button[aria-label="Feedback"]',
    ) as HTMLElement | null
    const previousDisplay = feedbackButton?.style.display

    try {
      setIsCapturing(true)
      const scrollY = window.scrollY
      const scrollX = window.scrollX

      if (feedbackButton) {
        feedbackButton.style.display = 'none'
      }

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve())
        })
      })

      const dataUrl = await domToPng(document.body, {
        backgroundColor: '#121214',
        scale: 1,
        width: window.innerWidth,
        height: window.innerHeight,
        style: {
          marginTop: `-${scrollY}px`,
          marginLeft: `-${scrollX}px`,
        },
      })

      setRawScreenshot(dataUrl)
      setIsCropping(true)
    } catch (error) {
      console.error('Capture failed', error)
      toast.showError('Falha ao capturar a tela.')
    } finally {
      if (feedbackButton) {
        feedbackButton.style.display = previousDisplay || 'flex'
      }

      setIsCapturing(false)
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

      console.log({ screenshotPreview })

      let screenshotUrl = screenshotPreview

      if (screenshotPreview?.startsWith('data:')) {
        try {
          const res = await fetch(screenshotPreview)
          const blob = await res.blob()
          const file = new File([blob], `feedback-screenshot-${Date.now()}.png`, {
            type: 'image/png',
          })
          console.log('file name', file.name)
          const uploadResponse = await storageService.uploadFile(
            StorageFolder.createAsFeedbackReports(),
            file,
          )

          if (uploadResponse.isSuccessful) {
            screenshotUrl = uploadResponse.body.filename
          } else {
            toast.showError('Falha ao enviar feedback.')
          }
        } catch (error) {
          console.error('Error uploading screenshot', error)
          toast.showError('Falha ao enviar feedback.')
        }
      }

      const feedbackReport = FeedbackReport.create({
        content,
        intent,
        author: author.dto,
        screenshot: screenshotUrl,
        sentAt: new Date().toISOString(),
      })

      const response = await reportingService.sendFeedbackReport(feedbackReport)
      if (response.isSuccessful) {
        setStep('success')
        toast.showSuccess('Feedback enviado com sucesso! Obrigado.')
      } else {
        toast.showError(response.errorMessage || 'Falha ao enviar feedback.')
      }
    } catch (error) {
      console.error('Error sending feedback', error)
      toast.showError('Erro inesperado ao enviar feedback.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isOpen,
    step,
    content,
    intent,
    screenshotPreview,
    rawScreenshot,
    isCapturing,
    isCropping,
    isLoading,
    setContent,
    handleSelectIntent,
    handleOpenChange,
    handleBack,
    handleReset,
    handleCapture,
    handleCropComplete,
    handleCancelCrop,
    handleDeleteScreenshot,
    handleSubmit,
  }
}
