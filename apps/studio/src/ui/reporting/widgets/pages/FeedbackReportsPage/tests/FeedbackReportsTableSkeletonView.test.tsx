import { render, screen } from '@testing-library/react'
import { FeedbackReportsTableSkeletonView } from '../FeedbackReportsTable/FeedbackReportsTableSkeleton/FeedbackReportsTableSkeletonView'

describe('FeedbackReportsTableSkeletonView', () => {
  it('should render table headers correctly', () => {
    render(<FeedbackReportsTableSkeletonView />)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Autor')).toBeInTheDocument()
    expect(screen.getByText('Tipo')).toBeInTheDocument()
    expect(screen.getByText('Data')).toBeInTheDocument()
    expect(screen.getByText('Preview')).toBeInTheDocument()
    expect(screen.getByText('Ações')).toBeInTheDocument()
  })

  it('should render 5 skeleton rows', () => {
    render(<FeedbackReportsTableSkeletonView />)

    // Check that we have multiple rows (header + 5 skeleton rows)
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBe(6) // 1 header + 5 skeleton rows
  })

  it('should render skeleton elements in each row', () => {
    render(<FeedbackReportsTableSkeletonView />)

    // Skeleton elements should be present in the table
    // We can check by looking for the presence of the skeleton styling
    const skeletonCells = screen.getAllByRole('cell')
    expect(skeletonCells.length).toBeGreaterThan(0)
  })
})
