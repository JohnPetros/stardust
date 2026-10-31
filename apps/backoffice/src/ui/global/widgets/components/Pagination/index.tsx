import { type PaginationProps, PaginationView } from './PaginationView'
import { usePagination } from './usePagination'

export const Pagination = (props: PaginationProps) => {
  const hookProps = usePagination(props)

  return <PaginationView {...props} {...hookProps} />
}
