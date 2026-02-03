import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FeedbackReportDialogView } from '../FeedbackReportDialog/FeedbackReportDialogView'
import { FeedbackReportsFaker } from '@stardust/core/reporting/entities/fakers'

describe('FeedbackReportDialogView', () => {
  const defaultProps = {
    report: null,
    isOpen: false,
    onClose: jest.fn(),
    onDelete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not render when isOpen is false', () => {
    const fakeReport = FeedbackReportsFaker.fake()

    render(
      <FeedbackReportDialogView {...defaultProps} report={fakeReport} isOpen={false} />,
    )

    // Dialog content should not be visible
    expect(screen.queryByText('Detalhes do feedback')).not.toBeInTheDocument()
  })

  it('should render when isOpen is true and report exists', () => {
    const fakeReport = FeedbackReportsFaker.fake()

    render(
      <FeedbackReportDialogView {...defaultProps} report={fakeReport} isOpen={true} />,
    )

    expect(screen.getByText('Detalhes do feedback')).toBeInTheDocument()
  })

  it('should display report content', () => {
    const content = 'Test feedback content'
    const fakeReport = FeedbackReportsFaker.fake({ content })

    render(
      <FeedbackReportDialogView {...defaultProps} report={fakeReport} isOpen={true} />,
    )

    expect(screen.getByText(content)).toBeInTheDocument()
  })

  it('should display formatted date', () => {
    const fakeReport = FeedbackReportsFaker.fake({
      sentAt: '2024-01-15T10:30:00.000Z',
    })

    render(
      <FeedbackReportDialogView {...defaultProps} report={fakeReport} isOpen={true} />,
    )

    // Date should be formatted as DD/MM/YYYY HH:mm:ss
    expect(screen.getByText('15/01/2024 10:30:00')).toBeInTheDocument()
  })

  it('should display author name', () => {
    const fakeReport = FeedbackReportsFaker.fake()
    const authorName = fakeReport.author.dto.entity?.name ?? 'Anônimo'

    render(
      <FeedbackReportDialogView {...defaultProps} report={fakeReport} isOpen={true} />,
    )

    expect(screen.getByText(`Enviado por ${authorName}`)).toBeInTheDocument()
  })

  it('should display truncated report ID', () => {
    const fakeReport = FeedbackReportsFaker.fake()
    const truncatedId = fakeReport.id.value.slice(0, 8).toUpperCase()

    render(
      <FeedbackReportDialogView {...defaultProps} report={fakeReport} isOpen={true} />,
    )

    expect(screen.getByText(`ID ${truncatedId}`)).toBeInTheDocument()
  })

  it('should display bug intent badge', () => {
    const fakeReport = FeedbackReportsFaker.fake({ intent: 'bug' })

    render(
      <FeedbackReportDialogView {...defaultProps} report={fakeReport} isOpen={true} />,
    )

    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('should display idea intent badge', () => {
    const fakeReport = FeedbackReportsFaker.fake({ intent: 'idea' })

    render(
      <FeedbackReportDialogView {...defaultProps} report={fakeReport} isOpen={true} />,
    )

    expect(screen.getByText('Ideia')).toBeInTheDocument()
  })

  it('should display other intent badge', () => {
    const fakeReport = FeedbackReportsFaker.fake({ intent: 'other' })

    render(
      <FeedbackReportDialogView {...defaultProps} report={fakeReport} isOpen={true} />,
    )

    expect(screen.getByText('Outro')).toBeInTheDocument()
  })

  it('should display screenshot when available', () => {
    const fakeReport = FeedbackReportsFaker.fake({
      screenshot: 'https://example.com/screenshot.png',
    })

    render(
      <FeedbackReportDialogView {...defaultProps} report={fakeReport} isOpen={true} />,
    )

    const screenshot = screen.getByAltText('Screenshot do feedback')
    expect(screenshot).toBeInTheDocument()
    expect(screenshot).toHaveAttribute('src', 'https://example.com/screenshot.png')
  })

  it('should display "Sem anexo" when no screenshot', () => {
    const fakeReport = FeedbackReportsFaker.fake({ screenshot: undefined })

    render(
      <FeedbackReportDialogView {...defaultProps} report={fakeReport} isOpen={true} />,
    )

    expect(screen.getByText('Sem anexo')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    const fakeReport = FeedbackReportsFaker.fake()

    render(
      <FeedbackReportDialogView
        {...defaultProps}
        report={fakeReport}
        isOpen={true}
        onClose={onClose}
      />,
    )

    const closeButton = screen.getByRole('button', { name: 'Fechar' })
    await user.click(closeButton)

    expect(onClose).toHaveBeenCalled()
  })

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = jest.fn()
    const fakeReport = FeedbackReportsFaker.fake()

    render(
      <FeedbackReportDialogView
        {...defaultProps}
        report={fakeReport}
        isOpen={true}
        onDelete={onDelete}
      />,
    )

    const deleteButton = screen.getByRole('button', { name: 'Deletar' })
    await user.click(deleteButton)

    expect(onDelete).toHaveBeenCalledWith(fakeReport)
  })

  it('should not display delete button when no report', () => {
    render(<FeedbackReportDialogView {...defaultProps} report={null} isOpen={true} />)

    expect(screen.queryByRole('button', { name: 'Deletar' })).not.toBeInTheDocument()
  })

  it('should display anonymous author correctly', () => {
    const fakeReport = FeedbackReportsFaker.fake()
    // Override author to simulate anonymous
    Object.defineProperty(fakeReport, 'author', {
      get: () => ({
        dto: {
          entity: null,
        },
      }),
    })

    render(
      <FeedbackReportDialogView {...defaultProps} report={fakeReport} isOpen={true} />,
    )

    expect(screen.getByText('Enviado por Anônimo')).toBeInTheDocument()
  })
})
