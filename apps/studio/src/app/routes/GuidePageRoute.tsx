import type { Route } from './+types/GuidePageRoute'
import { redirect } from 'react-router'

import { Id } from '@stardust/core/global/structures'

import { GuidePage } from '@/ui/manual/pages/GuidePage'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { RestMiddleware } from '../middlewares/RestMiddleware'
import { restContext } from '../contexts/RestContext'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

export const clientLoader = async ({ context, params }: Route.LoaderArgs) => {
  const { category, guideId } = params

  if (category !== 'lsp' && category !== 'mdx') {
    throw redirect('/404')
  }

  const { manualService } = context.get(restContext)
  const response = await manualService.fetchGuide(Id.create(guideId))

  if (response.isFailure) {
    if (response.statusCode === 404) {
      throw redirect('/404')
    }
    response.throwError()
  }

  return {
    guideDto: response.body,
  }
}

const GuidePageRoute = () => {
  return <GuidePage />
}

export default GuidePageRoute
