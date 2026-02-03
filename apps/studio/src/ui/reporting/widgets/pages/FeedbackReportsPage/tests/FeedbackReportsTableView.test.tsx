import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FeedbackReportsTableView } from '../FeedbackReportsTable/FeedbackReportsTableView'
import { FeedbackReportsFaker } from '@stardust/core/reporting/entities/fakers'

describe('FeedbackReportsTableView', () => {
  const defaultProps = {
    reports: [],
    isLoading: false,
    onView: jest.fn(),
    onDelete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render table headers correctly', () => {
    render(<FeedbackReportsTableView {...defaultProps} />)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Autor')).toBeInTheDocument()
    expect(screen.getByText('Tipo')).toBeInTheDocument()
    expect(screen.getByText('Data')).toBeInTheDocument()
    expect(screen.getByText('Preview')).toBeInTheDocument()
    expect(screen.getByText('Ações')).toBeInTheDocument()
  })

  it('should render empty state when no reports', () => {
    render(<FeedbackReportsTableView {...defaultProps} />)

    expect(screen.getByText('Nenhum feedback encontrado')).toBeInTheDocument()
  })

  it('should render skeleton when loading', () => {
    render(<FeedbackReportsTableView {...defaultProps} isLoading={true} />)

    // Skeleton rows should be present (5 rows by default)
    expect(screen.queryByText('Nenhum feedback encontrado')).not.toBeInTheDocument()
  })

  it('should render reports correctly', () => {
    const fakeReports = FeedbackReportsFaker.fakeMany(2)

    render(<FeedbackReportsTableView {...defaultProps} reports={fakeReports} />)

    // Should not show empty state
    expect(screen.queryByText('Nenhum feedback encontrado')).not.toBeInTheDocument()

    // Table should have data rows
    const rows = screen.getAllByRole('row')
    // Header row + 2 data rows
    expect(rows.length).toBeGreaterThan(2)
  })

  it('should display bug intent with destructive badge', () => {
    const fakeReport = FeedbackReportsFaker.fake({ intent: 'bug' })

    render(<FeedbackReportsTableView {...defaultProps} reports={[fakeReport]} />)

    expect(screen.getByText('Bug')).toBeInTheDocument()
  })

  it('should display idea intent with default badge', () => {
    const fakeReport = FeedbackReportsFaker.fake({ intent: 'idea' })

    render(<FeedbackReportsTableView {...defaultProps} reports={[fakeReport]} />)

    expect(screen.getByText('Ideia')).toBeInTheDocument()
  })

  it('should display other intent with secondary badge', () => {
    const fakeReport = FeedbackReportsFaker.fake({ intent: 'other' })

    render(<FeedbackReportsTableView {...defaultProps} reports={[fakeReport]} />)

    expect(screen.getByText('Outro')).toBeInTheDocument()
  })

  it('should display author name correctly', () => {
    const fakeReport = FeedbackReportsFaker.fake()
    const authorName = fakeReport.author.dto.entity?.name ?? 'Anônimo'

    render(<FeedbackReportsTableView {...defaultProps} reports={[fakeReport]} />)

    expect(screen.getByText(authorName)).toBeInTheDocument()
  })

  it('should display anonymous when author has no name', () => {
    const fakeReport = FeedbackReportsFaker.fake()
    // Override author to simulate anonymous
    Object.defineProperty(fakeReport, 'author', {
      get: () => ({
        dto: {
          entity: null,
        },
      }),
    })

    render(<FeedbackReportsTableView {...defaultProps} reports={[fakeReport]} />)

    expect(screen.getByText('Anônimo')).toBeInTheDocument()
  })

  it('should call onView when view button is clicked', async () => {
    const user = userEvent.setup()
    const onView = jest.fn()
    const fakeReport = FeedbackReportsFaker.fake()

    render(
      <FeedbackReportsTableView
        {...defaultProps}
        reports={[fakeReport]}
        onView={onView}
      />,
    )

    const viewButton = screen.getByRole('button', { name: 'Ver' })
    await user.click(viewButton)

    expect(onView).toHaveBeenCalledWith(fakeReport)
  })

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = jest.fn()
    const fakeReport = FeedbackReportsFaker.fake()

    render(
      <FeedbackReportsTableView
        {...defaultProps}
        reports={[fakeReport]}
        onDelete={onDelete}
      />,
    )

    const deleteButton = screen.getByRole('button', { name: 'Excluir' })
    await user.click(deleteButton)

    expect(onDelete).toHaveBeenCalledWith(fakeReport)
  })

  it('should display formatted date', () => {
    const fakeReport = FeedbackReportsFaker.fake({
      sentAt: '2024-01-15T10:30:00.000Z',
    })

    render(<FeedbackReportsTableView {...defaultProps} reports={[fakeReport]} />)

    // Date should be formatted as DD/MM/YYYY HH:mm:ss
    expect(screen.getByText('15/01/2024 10:30:00')).toBeInTheDocument()
  })

  it('should display screenshot when available', () => {
    const fakeReport = FeedbackReportsFaker.fake({
      screenshot: 'https://example.com/screenshot.png',
    })

    render(<FeedbackReportsTableView {...defaultProps} reports={[fakeReport]} />)

    const screenshot = screen.getByAltText('Screenshot')
    expect(screenshot).toBeInTheDocument()
  })

  it('should display content preview when no screenshot', () => {
    const content = 'This is a test feedback content that is longer than 40 characters'
    const fakeReport = FeedbackReportsFaker.fake({
      content,
      screenshot: undefined,
    })

    render(<FeedbackReportsTableView {...defaultProps} reports={[fakeReport]} />)

    // Should show truncated content
    expect(screen.getByText(content.slice(0, 40) + '...')).toBeInTheDocument()
  })

  it('should display short content without truncation', () => {
    const content = 'Short content'
    const fakeReport = FeedbackReportsFaker.fake({
      content,
      screenshot: undefined,
    })

    render(<FeedbackReportsTableView {...defaultProps} reports={[fakeReport]} />)

    expect(screen.getByText(content)).toBeInTheDocument()
  })

  it('should display ID truncated to 8 characters', () => {
    const fakeReport = FeedbackReportsFaker.fake()
    const truncatedId = fakeReport.id.value.slice(0, 8).toUpperCase()

    render(<FeedbackReportsTableView {...defaultProps} reports={[fakeReport]} />)

    expect(screen.getByText(truncatedId)).toBeInTheDocument()
  })
})
