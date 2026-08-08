import { useRef, useState } from 'react'

import { FeedbackReport } from '@stardust/core/reporting/entities'
import { FeedbackIntent } from '@stardust/core/reporting/structures'
import { AuthorAggregate } from '@stardust/core/global/aggregates'
import { Id, Integer, Text } from '@stardust/core/global/structures'
import type { ReportingService } from '@stardust/core/reporting/interfaces'
import type { SignedFileStorageProvider } from '@stardust/core/storage/interfaces'
import { SignedUploadUrl } from '@stardust/core/storage/structures'
import type { User } from '@stardust/core/global/entities'

import type { ToastContextValue } from '@/ui/global/contexts/ToastContext/types'

export type FeedbackStep = 'initial' | 'form' | 'success'

function getResponseErrorMessage(response: { errorMessage: string }, fallback: string) {
  try {
    return response.errorMessage
  } catch {
    return fallback
  }
}

type Params = {
  reportingService: ReportingService
  signedFileStorageProvider: SignedFileStorageProvider
  user: User | null
  toast: ToastContextValue
  onSubmitted?: () => void | Promise<void>
}

export function useFeedbackDialog({
  reportingService,
  signedFileStorageProvider,
  user,
  toast,
  onSubmitted,
}: Params) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<FeedbackStep>('initial')
  const [content, setContent] = useState('')
  const [intent, setIntent] = useState<string>('idea')
  const [screenshotPreview, setScreenshotPreview] = useState<string | undefined>()
  const [screenshotFile, setScreenshotFile] = useState<File | undefined>()
  const [rawScreenshot, setRawScreenshot] = useState<string | undefined>()
  const [isCapturing, setIsCapturing] = useState(false)
  const [isCropping, setIsCropping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isCaptureWarmRef = useRef(false)
  const captureWarmupPromiseRef = useRef<Promise<void> | null>(null)

  async function getToPng() {
    const { toPng } = await import('html-to-image')
    return toPng
  }

  function shouldCaptureNode(node: Node) {
    if (!(node instanceof HTMLElement)) return true

    if (node.dataset.feedbackIgnoreCapture === 'true') return false

    if (node instanceof HTMLImageElement && node.complete && node.naturalWidth === 0) {
      return false
    }

    return true
  }

  async function warmupCaptureEngine() {
    if (isCaptureWarmRef.current) return

    if (!captureWarmupPromiseRef.current) {
      captureWarmupPromiseRef.current = (async () => {
        let warmupNode: HTMLDivElement | null = null

        try {
          warmupNode = document.createElement('div')
          warmupNode.style.position = 'fixed'
          warmupNode.style.left = '-99999px'
          warmupNode.style.top = '-99999px'
          warmupNode.style.width = '16px'
          warmupNode.style.height = '16px'
          warmupNode.style.background = '#121214'

          document.body.appendChild(warmupNode)

          const toPng = await getToPng()
          await toPng(warmupNode, {
            backgroundColor: '#121214',
            width: 16,
            height: 16,
            pixelRatio: 1,
            filter: shouldCaptureNode,
          })

          isCaptureWarmRef.current = true
        } catch (error) {
          console.error('Failed to warm up capture engine', error)
          return
        } finally {
          if (warmupNode?.parentNode) {
            warmupNode.parentNode.removeChild(warmupNode)
          }
          captureWarmupPromiseRef.current = null
        }
      })()
    }

    await captureWarmupPromiseRef.current
  }

  function revokeScreenshotPreview() {
    if (screenshotPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(screenshotPreview)
    }
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open)
    if (open) void warmupCaptureEngine()

    // Keep an unfinished form draft while the page remains mounted. A
    // successful submission has no draft to preserve and can safely return to
    // the initial step when the dialog is dismissed.
    if (!open && !isCapturing && !isCropping && step === 'success') {
      setTimeout(() => {
        setStep('initial')
        setContent('')
        setIntent('idea')
        revokeScreenshotPreview()
        setScreenshotPreview(undefined)
        setScreenshotFile(undefined)
        setRawScreenshot(undefined)
        setIsCropping(false)
      }, 300)
    }
  }

  function handleSelectIntent(selectedIntent: string) {
    void warmupCaptureEngine()
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
    revokeScreenshotPreview()
    setScreenshotPreview(undefined)
    setScreenshotFile(undefined)
    setRawScreenshot(undefined)
    setIsCropping(false)
  }

  function handleSelectScreenshot(file: File) {
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      toast.showError('A imagem deve ser PNG ou JPEG.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.showError('A imagem deve ter no máximo 10 MB.')
      return
    }

    revokeScreenshotPreview()
    setScreenshotFile(file)
    setScreenshotPreview(URL.createObjectURL(file))
  }

  async function handleCapture() {
    const feedbackButton = document.querySelector(
      'button[aria-label="Feedback"]',
    ) as HTMLElement | null
    const previousDisplay = feedbackButton?.style.display

    try {
      await warmupCaptureEngine()
      setIsCapturing(true)

      const scrollY = window.scrollY
      const scrollX = window.scrollX

      if (feedbackButton) feedbackButton.style.display = 'none'

      document.documentElement.setAttribute('data-screenshot', 'true')
      ;(document.activeElement as HTMLElement | null)?.blur?.()

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })

      const toPng = await getToPng()
      const dataUrl = await toPng(document.body, {
        backgroundColor: '#121214',
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: 1,
        filter: shouldCaptureNode,
        style: {
          marginTop: `-${scrollY}px`,
          marginLeft: `-${scrollX}px`,
        },
      })

      document.documentElement.removeAttribute('data-screenshot')

      setRawScreenshot(dataUrl)
      setIsCropping(true)
    } catch (error) {
      document.documentElement.removeAttribute('data-screenshot')
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
    revokeScreenshotPreview()
    setScreenshotFile(undefined)
    setScreenshotPreview(croppedImage)
    setIsCropping(false)
    setRawScreenshot(undefined)
  }

  function handleCancelCrop() {
    setIsCropping(false)
    setRawScreenshot(undefined)
  }

  function handleDeleteScreenshot() {
    revokeScreenshotPreview()
    setScreenshotFile(undefined)
    setScreenshotPreview(undefined)
  }

  async function handleSubmit() {
    if (content.trim().length < 10 || content.trim().length > 1000) {
      toast.showError('O feedback deve ter entre 10 e 1.000 caracteres.')
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

      let screenshotUrl = screenshotPreview
      let initialAttachment:
        | {
            storageKey: string
            originalName: string
            mimeType: 'image/png' | 'image/jpeg'
            size: number
          }
        | undefined

      let fileToUpload = screenshotFile
      if (!fileToUpload && screenshotPreview?.startsWith('data:')) {
        try {
          const res = await fetch(screenshotPreview)
          const blob = await res.blob()
          const mimeType = blob.type === 'image/jpeg' ? 'image/jpeg' : 'image/png'
          const extension = mimeType === 'image/jpeg' ? 'jpg' : 'png'
          fileToUpload = new File([blob], `${Id.create().value}.${extension}`, {
            type: mimeType,
          })
        } catch (error) {
          console.error('Error preparing screenshot upload', error)
          toast.showError('Falha ao enviar feedback.')
          return
        }
      }

      if (fileToUpload) {
        try {
          const originalName = fileToUpload.name
          const mimeType = fileToUpload.type as 'image/png' | 'image/jpeg'
          const extension = mimeType === 'image/png' ? 'png' : 'jpg'
          const storageFile = new File(
            [fileToUpload],
            `${Id.create().value}.${extension}`,
            { type: mimeType, lastModified: fileToUpload.lastModified },
          )
          const fileName = Text.create(storageFile.name)
          const signedUploadUrlResponse =
            await reportingService.createFeedbackReportAttachmentUploadUrl({
              fileName,
              mimeType: Text.create(mimeType),
              size: Integer.create(fileToUpload.size),
            })

          if (signedUploadUrlResponse.isFailure) {
            toast.showError(
              getResponseErrorMessage(
                signedUploadUrlResponse,
                'Falha ao enviar feedback.',
              ),
            )
            return
          }

          const signedUploadUrl = SignedUploadUrl.create(signedUploadUrlResponse.body)
          await signedFileStorageProvider.uploadFile(signedUploadUrl, storageFile)
          screenshotUrl = signedUploadUrl.fileName.value
          initialAttachment = {
            storageKey: screenshotUrl,
            originalName,
            mimeType,
            size: fileToUpload.size,
          }
        } catch (error) {
          console.error('Error uploading screenshot', error)
          toast.showError('Falha ao enviar feedback.')
          return
        }
      }

      const response = initialAttachment
        ? await reportingService.sendFeedbackReport({
            content: Text.create(content),
            intent: FeedbackIntent.create(intent),
            initialAttachment,
          })
        : await reportingService.sendFeedbackReport(
            FeedbackReport.create({
              content,
              intent,
              author: author.dto,
              screenshot: screenshotUrl,
              sentAt: new Date().toISOString(),
            }),
          )
      if (response.isSuccessful) {
        setStep('success')
        await onSubmitted?.()
        toast.showSuccess('Feedback enviado com sucesso! Obrigado.')
      } else {
        toast.showError(getResponseErrorMessage(response, 'Falha ao enviar feedback.'))
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
    handleSelectScreenshot,
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
