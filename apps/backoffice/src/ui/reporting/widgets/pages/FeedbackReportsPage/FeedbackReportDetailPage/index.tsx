import { FeedbackReportDetailPageView } from './FeedbackReportDetailPage'
import { useFeedbackReportDetailPage } from './useFeedbackReportDetailPage'

export const FeedbackReportDetailPage = () => {
  const {
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
  } = useFeedbackReportDetailPage()

  return (
    <FeedbackReportDetailPageView
      detail={detail}
      isLoading={isLoading}
      error={error}
      content={content}
      files={files}
      isSending={isSending}
      isMutatingStatus={isMutatingStatus}
      onContentChange={setContent}
      onFilesChange={setFiles}
      onSend={send}
      onStatusChange={changeStatus}
      onBack={goBack}
    />
  )
}
