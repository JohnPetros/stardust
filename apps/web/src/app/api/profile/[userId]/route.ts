import { z } from 'zod'

import { idSchema } from '@stardust/validation/global/schemas'

import type { NextParams } from '@/rpc/next/types'
import { NextHttp } from '@/rest/next/NextHttp'
import { runApiRoute } from '@/rest/next/utils'
import { AccessProfilePageController } from '@/rest/controllers/profile'
import type { NextRequest } from 'next/server'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ProfileService } from '@/rest/services'

export const dynamic = 'force-dynamic'

const schema = z.object({
  routeParams: z.object({
    userId: idSchema,
  }),
})

type Schema = z.infer<typeof schema>

export async function GET(request: NextRequest, params: NextParams) {
  return runApiRoute(async () => {
    const http = await NextHttp<Schema>({ request, params, schema })
    const restClient = await NextServerRestClient()
    const service = ProfileService(restClient)
    const controller = AccessProfilePageController(service)
    return await controller.handle(http)
  })
}
