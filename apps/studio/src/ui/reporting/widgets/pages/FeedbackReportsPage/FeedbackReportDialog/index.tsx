import { useEffect, useState } from 'react'
import { Id, Integer, Text } from '@stardust/core/global/structures'
import { FeedbackReportStatus } from '@stardust/core/reporting/structures'
import { SignedUploadUrl } from '@stardust/core/storage/structures'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { S3SignedFileStorageProvider } from '@/provision/storage/S3SignedFileStorageProvider'
import { FeedbackReportDialogView } from './FeedbackReportDialogView'

export const FeedbackReportDialog = ({
  reportId,
  isOpen,
  onClose,
}: {
  reportId: string | null
  isOpen: boolean
  onClose: () => void
}) => {
  const { reportingService } = useRestContext()
  const toast = useToastProvider()
  const [detail, setDetail] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setLoading] = useState(false)
  const [isSending, setSending] = useState(false)
  const [isMutatingStatus, setMutatingStatus] = useState(false)
  useEffect(() => {
    if (!isOpen || !reportId) return
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
        if (response.body.latestUserMessageId)
          await reportingService.markFeedbackReportAsRead(
            Id.create(reportId),
            Id.create(response.body.latestUserMessageId),
          )
      })
      .finally(() => setLoading(false))
  }, [isOpen, reportId, reportingService])
  const onSend = async () => {
    if (!reportId || !detail || !content.trim()) return
    setSending(true)
    const messageId = Id.create(crypto.randomUUID())
    try {
      const attachments = []
      for (const file of files) {
        if (
          !['image/png', 'image/jpeg'].includes(file.type) ||
          file.size > 10 * 1024 * 1024
        )
          throw new Error('Use imagens PNG ou JPG de até 10 MB')
        const upload = await reportingService.createFeedbackAttachmentUploadUrl(
          Id.create(reportId),
          messageId,
          {
            // The storage contract accepts only a UUID filename. Keep the
            // user's name as metadata on the message attachment instead.
            fileName: Text.create(
              `${crypto.randomUUID()}.${file.type === 'image/png' ? 'png' : 'jpg'}`,
            ),
            mimeType: Text.create(file.type),
            size: Integer.create(file.size),
          },
        )
        if (upload.isFailure) throw new Error(upload.errorMessage)
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
      if (response.isFailure) throw new Error(response.errorMessage)
      setContent('')
      setFiles([])
      toast.showSuccess('Resposta enviada')
      setDetail((current: any) =>
        current
          ? {
              ...current,
              status: response.body.report.status,
              messages: [...current.messages, response.body.message],
            }
          : current,
      )
    } catch (failure) {
      toast.showError(failure instanceof Error ? failure.message : String(failure))
    } finally {
      setSending(false)
    }
  }
  const onStatusChange = async () => {
    if (!reportId || !detail) return
    setMutatingStatus(true)
    const status = detail.status === 'open' ? 'closed' : 'open'
    const response = await reportingService.changeFeedbackReportStatus(
      Id.create(reportId),
      {
        status: FeedbackReportStatus.create(status),
        expectedStatus: FeedbackReportStatus.create(detail.status),
      },
    )
    if (response.isFailure) toast.showError(response.errorMessage)
    else setDetail((current: any) => (current ? { ...current, status } : current))
    setMutatingStatus(false)
  }
  return (
    <FeedbackReportDialogView
      detail={detail}
      isOpen={isOpen}
      isLoading={isLoading}
      error={error}
      content={content}
      files={files}
      isSending={isSending}
      isMutatingStatus={isMutatingStatus}
      onContentChange={setContent}
      onFilesChange={setFiles}
      onSend={onSend}
      onStatusChange={onStatusChange}
      onClose={onClose}
    />
  )
}
