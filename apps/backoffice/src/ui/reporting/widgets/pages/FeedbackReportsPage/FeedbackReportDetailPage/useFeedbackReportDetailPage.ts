import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import type { FeedbackReportDetailsDto } from '@stardust/core/reporting/entities/dtos'
import { FeedbackReportStatus } from '@stardust/core/reporting/structures'
import { AppError } from '@stardust/core/global/errors'
import { Id, Integer, Text } from '@stardust/core/global/structures'
import { SignedUploadUrl } from '@stardust/core/storage/structures'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { S3SignedFileStorageProvider } from '@/provision/storage/S3SignedFileStorageProvider'

export function useFeedbackReportDetailPage() {
  const navigate = useNavigate()
  const { feedbackReportId: reportId } = useParams()
  const { reportingService } = useRestContext()
  const toast = useToastProvider()
  const [detail, setDetail] = useState<FeedbackReportDetailsDto | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setLoading] = useState(false)
  const [isSending, setSending] = useState(false)
  const [isMutatingStatus, setMutatingStatus] = useState(false)

  useEffect(() => {
    if (!reportId) return
    setLoading(true)
    setError(null)
    void reportingService
      .getFeedbackReport(Id.create(reportId))
      .then(async (response) => {
        if (response.isFailure) {
          setError(response.errorMessage)
          return
        }
        setDetail(response.body)
        if (response.body.latestUserMessageId) {
          await reportingService.markFeedbackReportAsRead(
            Id.create(reportId),
            Id.create(response.body.latestUserMessageId),
          )
        }
      })
      .finally(() => setLoading(false))
  }, [reportId, reportingService])

  async function send() {
    if (!reportId || !detail || !content.trim()) return
    setSending(true)
    const messageId = Id.create(crypto.randomUUID())
    try {
      const attachments = []
      for (const file of files) {
        if (
          !['image/png', 'image/jpeg'].includes(file.type) ||
          file.size > 10 * 1024 * 1024
        ) {
          throw new AppError('Use imagens PNG ou JPG de até 10 MB')
        }
        const upload = await reportingService.createFeedbackAttachmentUploadUrl(
          Id.create(reportId),
          messageId,
          {
            fileName: Text.create(
              `${crypto.randomUUID()}.${file.type === 'image/png' ? 'png' : 'jpg'}`,
            ),
            mimeType: Text.create(file.type),
            size: Integer.create(file.size),
          },
        )
        if (upload.isFailure) throw new AppError(upload.errorMessage)
        await S3SignedFileStorageProvider().uploadFile(
          SignedUploadUrl.create(upload.body),
          file,
        )
        attachments.push({
          id: crypto.randomUUID(),
          storageKey: `${upload.body.folderPath}/${upload.body.fileName}`,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
        })
      }
      const response = await reportingService.sendFeedbackMessage(Id.create(reportId), {
        messageId,
        content: Text.create(content),
        attachments,
      })
      if (response.isFailure) throw new AppError(response.errorMessage)
      setContent('')
      setFiles([])
      toast.showSuccess('Resposta enviada')
      setDetail((current) =>
        current
          ? {
              ...current,
              status: response.body.report.status,
              messages: [...current.messages, response.body.message],
            }
          : current,
      )
    } catch (failure) {
      toast.showError(failure instanceof AppError ? failure.message : String(failure))
    } finally {
      setSending(false)
    }
  }

  async function changeStatus() {
    if (!reportId || !detail) return
    setMutatingStatus(true)
    const currentStatus = detail.status ?? 'open'
    const status = currentStatus === 'open' ? 'closed' : 'open'
    const response = await reportingService.changeFeedbackReportStatus(
      Id.create(reportId),
      {
        status: FeedbackReportStatus.create(status),
        expectedStatus: FeedbackReportStatus.create(currentStatus),
      },
    )
    if (response.isFailure) toast.showError(response.errorMessage)
    else setDetail((current) => (current ? { ...current, status } : current))
    setMutatingStatus(false)
  }

  function goBack() {
    navigate('/reporting/feedback')
  }

  return {
    reportId,
    detail,
    error,
    content,
    files,
    isLoading,
    isSending,
    isMutatingStatus,
    setContent,
    setFiles,
    send,
    changeStatus,
    goBack,
  }
}
