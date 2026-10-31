import { Link } from '@tanstack/react-router'
import { ROUTES } from '@/constants/routes'
import { CenteredContainer } from '@/ui/shared/widgets/components/centered-container'

export const NotFoundPage = () => {
  return (
    <CenteredContainer>
      <div className='flex flex-col items-center gap-2'>
        <span>Project or scene not found.</span>
        <Link to={ROUTES.root} className='text-foreground underline'>
          Back to projects
        </Link>
      </div>
    </CenteredContainer>
  )
}
