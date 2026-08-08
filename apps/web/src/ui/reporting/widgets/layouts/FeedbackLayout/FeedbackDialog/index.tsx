'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Id, Integer, OrdinalNumber, Text } from '@stardust/core/global/structures'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useFeedbackDialog } from './useFeedbackDialog'
import { FeedbackDialogView } from './FeedbackDialogView'
import type {
  FeedbackFilter,
  FeedbackRequestState,
  FeedbackConversationDraft,
} from '@/ui/reporting/types'
import type {
  FeedbackReportDetailsDto,
  FeedbackReportDto,
} from '@stardust/core/reporting/entities/dtos'

function getResponseErrorMessage(response: { errorMessage: string }, fallback: string) {
  try {
    return response.errorMessage
  } catch {
    return fallback
  }
}

export function FeedbackDialog() {
  const { reportingService, signedFileStorageProvider } = useRestContext()
  const { user } = useAuthContext()
  const toast = useToastContext()
  const pathname = usePathname()
  const [view, setView] = useState<'dialog' | 'history' | 'detail'>('dialog')
  const [reports, setReports] = useState<FeedbackReportDto[]>([])
  const [detail, setDetail] = useState<FeedbackReportDetailsDto | null>(null)
  const [detailState, setDetailState] = useState<FeedbackRequestState>('idle')
  const [filter, setFilter] = useState<FeedbackFilter>('all')
  const [listState, setListState] = useState<FeedbackRequestState>('idle')
  const [unreadCount, setUnreadCount] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [draft, setDraft] = useState<FeedbackConversationDraft>({
    content: '',
    attachments: [],
  })
  const [draftsByReport, setDraftsByReport] = useState<
    Record<string, FeedbackConversationDraft>
  >({})
  const [replyLoading, setReplyLoading] = useState(false)
  const hasRequestedInitialUnreadCount = useRef(false)
  const refreshUnreadCount = useCallback(async () => {
    const response = await reportingService.countMyUnreadFeedbackReports()
    if (response.isSuccessful) setUnreadCount(response.body.count)
  }, [reportingService])
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
    handleSelectScreenshot,
    handleBack,
    handleReset,
    handleCapture,
    handleCropComplete,
    handleCancelCrop,
    handleDeleteScreenshot,
    handleSubmit,
  } = useFeedbackDialog({
    reportingService,
    signedFileStorageProvider,
    user,
    toast,
    onSubmitted: refreshUnreadCount,
  })

  useEffect(() => {
    if (hasRequestedInitialUnreadCount.current) return
    hasRequestedInitialUnreadCount.current = true
    void refreshUnreadCount()
  }, [refreshUnreadCount])

  const loadHistory = useCallback(
    async (nextPage = 1, nextFilter = filter) => {
      setListState('loading')
      const status = nextFilter === 'all' ? undefined : nextFilter
      const [listResponse, unreadResponse] = await Promise.all([
        reportingService.listMyFeedbackReports({
          status,
          page: OrdinalNumber.create(nextPage),
          itemsPerPage: OrdinalNumber.create(10),
        }),
        reportingService.countMyUnreadFeedbackReports(),
      ])
      if (listResponse.isFailure) {
        setListState('error')
        return
      }
      setReports(
        nextPage === 1
          ? listResponse.body.items
          : [...reports, ...listResponse.body.items],
      )
      setPage(nextPage)
      setHasMore(nextPage * 10 < listResponse.body.total)
      if (unreadResponse.isSuccessful) setUnreadCount(unreadResponse.body.count)
      setListState(listResponse.body.items.length === 0 ? 'empty' : 'content')
    },
    [filter, reports, reportingService],
  )

  useEffect(() => {
    if (view === 'history' && listState === 'idle') void loadHistory()
  }, [view, listState, loadHistory])

  const handleOpenChangeRef = useRef(handleOpenChange)
  const openDetailRef = useRef(openDetail)
  handleOpenChangeRef.current = handleOpenChange
  openDetailRef.current = openDetail

  useEffect(() => {
    const match = pathname?.match(/^\/feedback\/([^/]+)$/)
    if (match) {
      setView('detail')
      handleOpenChangeRef.current(true)
      void openDetailRef.current(match[1])
    }
  }, [pathname])

  function openHistory() {
    setView('history')
    setListState('idle')
  }

  async function openDetail(id: string, draftOverride?: FeedbackConversationDraft) {
    setView('detail')
    setDetail(null)
    setDetailState('loading')
    try {
      const response = await reportingService.getMyFeedbackReport(Id.create(id))
      if (response.isSuccessful) {
        setDetail(response.body)
        setDetailState('content')
        setDraft(draftOverride ?? draftsByReport[id] ?? { content: '', attachments: [] })
        const lastAdminMessageId = response.body.latestAdminMessageId
        if (lastAdminMessageId) {
          const readResponse = await reportingService.markMyFeedbackReportAsRead(
            Id.create(id),
            Id.create(lastAdminMessageId),
          )
          if (readResponse.isSuccessful && response.body.hasUnreadAdminReply) {
            setUnreadCount((count) => Math.max(0, count - 1))
          }
        }
      } else {
        setDetailState('error')
        toast.showError('Não foi possível abrir o reporte.')
      }
    } catch {
      setDetailState('error')
      toast.showError('Não foi possível abrir o reporte.')
    }
  }

  async function sendReply() {
    if (!detail?.id || !draft.content.trim()) return
    const reportId = detail.id
    setReplyLoading(true)
    try {
      const messageId = Id.create()
      const attachments = []
      for (const attachment of draft.attachments) {
        const upload = await reportingService.createFeedbackAttachmentUploadUrl(
          Id.create(detail.id),
          messageId,
          {
            fileName: Text.create(attachment.file.name),
            mimeType: Text.create(attachment.file.type),
            size: Integer.create(attachment.file.size),
          },
        )
        if (upload.isFailure) {
          toast.showError(
            getResponseErrorMessage(upload, 'Não foi possível enviar o anexo.'),
          )
          return
        }
        const signedUrl = (
          await import('@stardust/core/storage/structures')
        ).SignedUploadUrl.create(upload.body)
        await signedFileStorageProvider.uploadFile(signedUrl, attachment.file)
        attachments.push({
          id: Id.create().value,
          storageKey: signedUrl.fileName.value,
          originalName: attachment.file.name,
          mimeType: attachment.file.type,
          size: attachment.file.size,
        })
      }
      const response = await reportingService.sendFeedbackMessage(Id.create(detail.id), {
        messageId,
        content: Text.create(draft.content.trim()),
        attachments,
      })
      if (response.isFailure) {
        toast.showError(
          getResponseErrorMessage(response, 'Não foi possível enviar a resposta.'),
        )
        return
      }

      const emptyDraft = { content: '', attachments: [] }
      await openDetail(detail.id, emptyDraft)
      await refreshUnreadCount()
      // Apply the canonical post-send state after every async refresh. This
      // prevents the detail reload from restoring the submitted draft.
      setDraft(emptyDraft)
      setDraftsByReport((current) => ({
        ...current,
        [reportId]: emptyDraft,
      }))
    } catch (error) {
      console.error('Error sending feedback reply', error)
      toast.showError('Não foi possível enviar a resposta.')
    } finally {
      setReplyLoading(false)
    }
  }

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
      handleSelectScreenshot={handleSelectScreenshot}
      handleBack={handleBack}
      handleReset={handleReset}
      handleCapture={handleCapture}
      handleCropComplete={handleCropComplete}
      handleCancelCrop={handleCancelCrop}
      handleDeleteScreenshot={handleDeleteScreenshot}
      handleSubmit={handleSubmit}
      view={view}
      reports={reports}
      detail={detail}
      filter={filter}
      listState={listState}
      unreadCount={unreadCount}
      hasMore={hasMore}
      draft={draft}
      replyLoading={replyLoading}
      onOpenHistory={openHistory}
      onFilterChange={(nextFilter) => {
        setFilter(nextFilter)
        setListState('idle')
      }}
      onSelectReport={openDetail}
      onLoadMore={() => void loadHistory(page + 1)}
      onRetry={() => void loadHistory(1)}
      onBackToHome={() => setView('dialog')}
      onDraftChange={(nextDraft) => {
        setDraft(nextDraft)
        if (detail?.id) {
          const reportId = detail.id
          setDraftsByReport((current) => ({ ...current, [reportId]: nextDraft }))
        }
      }}
      detailState={detailState}
      onSendReply={() => void sendReply()}
    />
  )
}
