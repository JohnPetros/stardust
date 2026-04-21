'use server'

import { z } from 'zod'

import { Slug } from '@stardust/core/global/structures'
import { authActionClient } from './clients/authActionClient'
import { NextCall } from '../next/NextCall'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ProfileService } from '@/rest/services'
import { stringSchema } from '@stardust/validation/global/schemas'

const accessProfilePage = authActionClient
  .schema(
    z.object({
      userSlug: stringSchema,
    }),
  )
  .action(async ({ clientInput }) => {
    const restClient = await NextServerRestClient()
    const profileService = ProfileService(restClient)
    const response = await profileService.fetchUserBySlug(
      Slug.create(clientInput.userSlug),
    )
    const call = NextCall({ request: clientInput })

    if (response.isFailure) call.notFound()
    return response.body
  })

export { accessProfilePage }
