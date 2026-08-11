import { useCallback, useEffect, useRef, useState } from 'react'
import { Id, Integer, OrdinalNumber, Text } from '@stardust/core/global/structures'
import type { ReportingService } from '@stardust/core/reporting/interfaces'
import type { SignedFileStorageProvider } from '@stardust/core/storage/interfaces'
import type {
  FeedbackReportDetailsDto,
  FeedbackReportDto,
} from '@stardust/core/reporting/entities/dtos'
import type { User } from '@stardust/core/global/entities'

import { useFeedbackDialog } from './useFeedbackDialog'
import type {
  FeedbackConversationDraft,
  FeedbackFilter,
  FeedbackRequestState,
} from '@/ui/reporting/types'
import type { ToastContextValue } from '@/ui/global/contexts/ToastContext/types'

type Params = {
  reportingService: ReportingService
  signedFileStorageProvider: SignedFileStorageProvider
  user: User | null
  toast: ToastContextValue
  pathname: string | null
}

function getResponseErrorMessage(response: { errorMessage: string }, fallback: string) {
  try {
    return response.errorMessage
  } catch {
    return fallback
  }
}

export function createFeedbackAttachmentStorageFile(file: File): File {
  const extension = file.type === 'image/png' ? 'png' : 'jpg'

  return new File([file], `${Id.create().value}.${extension}`, {
    type: file.type,
    lastModified: file.lastModified,
  })
}

export function useFeedbackDialogController({
  reportingService,
  signedFileStorageProvider,
  user,
  toast,
  pathname,
}: Params) {
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

  const refreshUnreadCount = useCallback(async () => {
    const response = await reportingService.countMyUnreadFeedbackReports()
    if (response.isSuccessful) setUnreadCount(response.body.count)
  }, [reportingService])

  const feedbackDialog = useFeedbackDialog({
    reportingService,
    signedFileStorageProvider,
    user,
    toast,
    onSubmitted: refreshUnreadCount,
  })

  const hasRequestedInitialUnreadCount = useRef(false)
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

  function openHistory() {
    setView('history')
    setListState('idle')
  }

  async function openDetail(id: string, draftOverride?: FeedbackConversationDraft) {
    setView('detail')
    setDetail(null)
    setDetailState('loading')
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
  }

  const openDetailRef = useRef(openDetail)
  openDetailRef.current = openDetail
  const handleOpenChangeRef = useRef(feedbackDialog.handleOpenChange)
  handleOpenChangeRef.current = feedbackDialog.handleOpenChange

  useEffect(() => {
    const match = pathname?.match(/^\/feedback\/([^/]+)$/)
    if (!match) return
    setView('detail')
    handleOpenChangeRef.current(true)
    void openDetailRef.current(match[1])
  }, [pathname])

  async function sendReply() {
    if (!detail?.id || !draft.content.trim()) return
    const reportId = detail.id
    setReplyLoading(true)
    try {
      const messageId = Id.create()
      const attachments = []
      for (const attachment of draft.attachments) {
        const storageFile = createFeedbackAttachmentStorageFile(attachment.file)
        const upload = await reportingService.createFeedbackAttachmentUploadUrl(
          Id.create(detail.id),
          messageId,
          {
            fileName: Text.create(storageFile.name),
            mimeType: Text.create(storageFile.type),
            size: Integer.create(storageFile.size),
          },
        )
        if (upload.isFailure) {
          toast.showError(
            getResponseErrorMessage(upload, 'Não foi possível enviar o anexo.'),
          )
          return
        }
        const { SignedUploadUrl } = await import('@stardust/core/storage/structures')
        const signedUrl = SignedUploadUrl.create(upload.body)
        await signedFileStorageProvider.uploadFile(signedUrl, storageFile)
        attachments.push({
          id: Id.create().value,
          storageKey: `${signedUrl.folderPath.value}/${signedUrl.fileName.value}`,
          originalName: attachment.file.name,
          mimeType: storageFile.type,
          size: storageFile.size,
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

  function handleFilterChange(nextFilter: FeedbackFilter) {
    setFilter(nextFilter)
    setListState('idle')
  }

  function handleDraftChange(nextDraft: FeedbackConversationDraft) {
    setDraft(nextDraft)
    if (detail?.id) {
      const reportId = detail.id
      setDraftsByReport((current) => ({ ...current, [reportId]: nextDraft }))
    }
  }

  return {
    ...feedbackDialog,
    onOpenChange: feedbackDialog.handleOpenChange,
    onContentChange: feedbackDialog.setContent,
    view,
    reports,
    detail,
    filter,
    listState,
    unreadCount,
    hasMore,
    draft,
    replyLoading,
    detailState,
    onOpenHistory: openHistory,
    onFilterChange: handleFilterChange,
    onSelectReport: openDetail,
    onLoadMore: () => void loadHistory(page + 1),
    onRetry: () => void loadHistory(1),
    onBackToHome: () => setView('dialog'),
    onDraftChange: handleDraftChange,
    onSendReply: () => void sendReply(),
  }
}
