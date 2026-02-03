import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FeedbackReportsPageView } from '../FeedbackReportsPageView'
import { FeedbackReportsFaker } from '@stardust/core/reporting/entities/fakers'
import type { FeedbackReportsFilters } from '../useFeedbackReportsPage'

describe('FeedbackReportsPageView', () => {
  const defaultFilters: FeedbackReportsFilters = {
    page: 1,
    itemsPerPage: 10,
    authorName: '',
    intent: 'all',
  }

  const defaultProps = {
    reports: [],
    isLoading: false,
    totalItemsCount: 0,
    totalPages: 0,
    filters: defaultFilters,
    selectedReport: null,
    reportToDelete: null,
    isDeleting: false,
    onAuthorNameChange: jest.fn(),
    onIntentChange: jest.fn(),
    onCreationPeriodChange: jest.fn(),
    onViewReport: jest.fn(),
    onDeleteReport: jest.fn(),
    onCloseReportDialog: jest.fn(),
    onCloseDeleteDialog: jest.fn(),
    onConfirmDelete: jest.fn(),
    onNextPage: jest.fn(),
    onPrevPage: jest.fn(),
    onPageChange: jest.fn(),
    onItemsPerPageChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render page title and description', () => {
    render(<FeedbackReportsPageView {...defaultProps} />)

    expect(screen.getByText('Relatórios de Feedback')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Visualize e gerencie os relatórios de feedback enviados pelos usuários.',
      ),
    ).toBeInTheDocument()
  })

  it('should render filters section', () => {
    render(<FeedbackReportsPageView {...defaultProps} />)

    expect(screen.getByPlaceholderText('Filtrar por autor...')).toBeInTheDocument()
    expect(screen.getByText('Tipo:')).toBeInTheDocument()
  })

  it('should render empty state when no reports', () => {
    render(<FeedbackReportsPageView {...defaultProps} />)

    expect(screen.getByText('Nenhum feedback encontrado')).toBeInTheDocument()
  })

  it('should render table with reports', () => {
    const fakeReports = FeedbackReportsFaker.fakeMany(2)

    render(<FeedbackReportsPageView {...defaultProps} reports={fakeReports} />)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Autor')).toBeInTheDocument()
    expect(screen.getByText('Tipo')).toBeInTheDocument()
    expect(screen.getByText('Data')).toBeInTheDocument()
    expect(screen.getByText('Preview')).toBeInTheDocument()
    expect(screen.getByText('Ações')).toBeInTheDocument()
  })

  it('should render skeleton when loading', () => {
    render(<FeedbackReportsPageView {...defaultProps} isLoading={true} />)

    // Skeleton should be rendered (checking for absence of "Nenhum feedback encontrado")
    expect(screen.queryByText('Nenhum feedback encontrado')).not.toBeInTheDocument()
  })

  it('should handle author name filter change', async () => {
    const user = userEvent.setup()
    const onAuthorNameChange = jest.fn()

    render(
      <FeedbackReportsPageView
        {...defaultProps}
        onAuthorNameChange={onAuthorNameChange}
      />,
    )

    const input = screen.getByPlaceholderText('Filtrar por autor...')
    await user.type(input, 'John')

    expect(onAuthorNameChange).toHaveBeenCalled()
  })

  it('should handle pagination when multiple pages', () => {
    const fakeReports = FeedbackReportsFaker.fakeMany(10)

    render(
      <FeedbackReportsPageView
        {...defaultProps}
        reports={fakeReports}
        totalPages={3}
        totalItemsCount={30}
        filters={{ ...defaultFilters, page: 2 }}
      />,
    )

    // Pagination should be rendered when totalPages > 1
    // Check for pagination elements
    expect(screen.getByText('Anterior')).toBeInTheDocument()
    expect(screen.getByText('Próxima')).toBeInTheDocument()
    expect(screen.getByText('de 3')).toBeInTheDocument()
  })

  it('should not render pagination when only one page', () => {
    render(
      <FeedbackReportsPageView
        {...defaultProps}
        totalPages={1}
        filters={defaultFilters}
      />,
    )

    // Pagination should not be visible
    const paginationElements = screen.queryAllByRole('navigation')
    expect(paginationElements.length).toBe(0)
  })

  it('should pass correct props to FeedbackReportsTable', () => {
    const fakeReports = FeedbackReportsFaker.fakeMany(2)
    const onViewReport = jest.fn()
    const onDeleteReport = jest.fn()

    render(
      <FeedbackReportsPageView
        {...defaultProps}
        reports={fakeReports}
        isLoading={false}
        onViewReport={onViewReport}
        onDeleteReport={onDeleteReport}
      />,
    )

    // Table headers should be present
    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Autor')).toBeInTheDocument()
  })

  it('should render FeedbackReportDialog when report is selected', () => {
    const fakeReport = FeedbackReportsFaker.fake()

    render(<FeedbackReportsPageView {...defaultProps} selectedReport={fakeReport} />)

    // Dialog should be rendered with report details
    expect(screen.getByText('Detalhes do feedback')).toBeInTheDocument()
  })

  it('should render DeleteFeedbackReportDialog when reportToDelete exists', () => {
    const fakeReport = FeedbackReportsFaker.fake()

    render(<FeedbackReportsPageView {...defaultProps} reportToDelete={fakeReport} />)

    expect(screen.getByText('Deletar feedback')).toBeInTheDocument()
  })

  it('should display correct filters values', () => {
    const filters: FeedbackReportsFilters = {
      page: 1,
      itemsPerPage: 10,
      authorName: 'John Doe',
      intent: 'bug',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
    }

    render(<FeedbackReportsPageView {...defaultProps} filters={filters} />)

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
  })
})
