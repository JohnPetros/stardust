import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteFeedbackReportDialogView } from '../DeleteFeedbackReportDialog/DeleteFeedbackReportDialogView'
import { FeedbackReportsFaker } from '@stardust/core/reporting/entities/fakers'

describe('DeleteFeedbackReportDialogView', () => {
  const defaultProps = {
    report: null,
    isOpen: false,
    isDeleting: false,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not render when isOpen is false', () => {
    const fakeReport = FeedbackReportsFaker.fake()

    render(
      <DeleteFeedbackReportDialogView
        {...defaultProps}
        report={fakeReport}
        isOpen={false}
      />,
    )

    // Dialog content should not be visible
    expect(screen.queryByText('Deletar feedback')).not.toBeInTheDocument()
  })

  it('should render when isOpen is true', () => {
    const fakeReport = FeedbackReportsFaker.fake()

    render(
      <DeleteFeedbackReportDialogView
        {...defaultProps}
        report={fakeReport}
        isOpen={true}
      />,
    )

    expect(screen.getByText('Deletar feedback')).toBeInTheDocument()
  })

  it('should display confirmation message with author name', () => {
    const fakeReport = FeedbackReportsFaker.fake()
    const authorName = fakeReport.author.dto.entity?.name ?? 'Anônimo'

    render(
      <DeleteFeedbackReportDialogView
        {...defaultProps}
        report={fakeReport}
        isOpen={true}
      />,
    )

    expect(
      screen.getByText(`Tem certeza que deseja deletar o feedback de ${authorName}?`),
    ).toBeInTheDocument()
  })

  it('should display generic message when no report', () => {
    render(
      <DeleteFeedbackReportDialogView {...defaultProps} report={null} isOpen={true} />,
    )

    expect(
      screen.getByText('Tem certeza que deseja deletar este feedback?'),
    ).toBeInTheDocument()
  })

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    const fakeReport = FeedbackReportsFaker.fake()

    render(
      <DeleteFeedbackReportDialogView
        {...defaultProps}
        report={fakeReport}
        isOpen={true}
        onClose={onClose}
      />,
    )

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
    await user.click(cancelButton)

    expect(onClose).toHaveBeenCalled()
  })

  it('should call onConfirm when delete button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = jest.fn()
    const fakeReport = FeedbackReportsFaker.fake()

    render(
      <DeleteFeedbackReportDialogView
        {...defaultProps}
        report={fakeReport}
        isOpen={true}
        onConfirm={onConfirm}
      />,
    )

    const deleteButton = screen.getByRole('button', { name: 'Deletar' })
    await user.click(deleteButton)

    expect(onConfirm).toHaveBeenCalled()
  })

  it('should disable delete button when isDeleting is true', () => {
    const fakeReport = FeedbackReportsFaker.fake()

    render(
      <DeleteFeedbackReportDialogView
        {...defaultProps}
        report={fakeReport}
        isOpen={true}
        isDeleting={true}
      />,
    )

    const deleteButton = screen.getByRole('button', { name: 'Deletando...' })
    expect(deleteButton).toBeDisabled()
  })

  it('should show "Deletando..." text when isDeleting is true', () => {
    const fakeReport = FeedbackReportsFaker.fake()

    render(
      <DeleteFeedbackReportDialogView
        {...defaultProps}
        report={fakeReport}
        isOpen={true}
        isDeleting={true}
      />,
    )

    expect(screen.getByText('Deletando...')).toBeInTheDocument()
  })

  it('should show "Deletar" text when isDeleting is false', () => {
    const fakeReport = FeedbackReportsFaker.fake()

    render(
      <DeleteFeedbackReportDialogView
        {...defaultProps}
        report={fakeReport}
        isOpen={true}
        isDeleting={false}
      />,
    )

    expect(screen.getByText('Deletar')).toBeInTheDocument()
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
      <DeleteFeedbackReportDialogView
        {...defaultProps}
        report={fakeReport}
        isOpen={true}
      />,
    )

    expect(
      screen.getByText('Tem certeza que deseja deletar o feedback de Anônimo?'),
    ).toBeInTheDocument()
  })
})
