type Props = {
  params: Promise<{ feedbackReportId: string }>
}

export default async function FeedbackReportPage({ params }: Props) {
  const { feedbackReportId } = await params

  return (
    <main
      aria-label='Feedback report'
      className='min-h-full'
      data-feedback-report-id={feedbackReportId}
    />
  )
}
