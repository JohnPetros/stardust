import type { NextRequest } from 'next/server'
import { z } from 'zod'

import { stringSchema } from '@stardust/validation/global/schemas'

import type { NextParams } from '@/rpc/next/types'
import { NextHttp } from '@/rest/next/NextHttp'
import { runApiRoute } from '@/rest/next/utils'
import { AccessSolutionPageController } from '@/rest/controllers/challenging'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ChallengingService } from '@/rest/services/ChallengingService'

const schema = z.object({
  routeParams: z.object({
    solutionSlug: stringSchema,
  }),
})

type Schema = z.infer<typeof schema>

export async function GET(request: NextRequest, params: NextParams) {
  return await runApiRoute(async () => {
    const http = await NextHttp<Schema>({ request, schema, params })
    const restClient = await NextServerRestClient()
    const challengingService = ChallengingService(restClient)
    const controller = AccessSolutionPageController(challengingService)
    return await controller.handle(http)
  })
}
