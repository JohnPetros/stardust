import { useParams, Navigate } from 'react-router'
import { GuideCategory } from '@stardust/core/manual/structures'
import { GuidesPage } from '@/ui/manual/widgets/pages/GuidesPage'
import { ROUTES } from '@/constants/routes'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { RestMiddleware } from '../middlewares/RestMiddleware'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

const GuidesRoute = () => {
  const { category } = useParams<{ category: string }>()

  if (!category || !GuideCategory.isValid(category)) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  const guideCategory = GuideCategory.create(category)

  return <GuidesPage category={guideCategory} />
}

export default GuidesRoute
