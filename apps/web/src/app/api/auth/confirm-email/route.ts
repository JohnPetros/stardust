import type { NextRequest } from 'next/server'
import { z } from 'zod'

import { NextHttp } from '@/rest/next/NextHttp'
import { runApiRoute } from '@/rest/next/utils'
import { ConfirmEmailController } from '@/rest/controllers/auth'
import { NextApiRestClient } from '@/rest/next/NextApiRestClient'
import { AuthService } from '@/rest/services/AuthService'

export const dynamic = 'force-dynamic'

const schema = z.object({
  queryParams: z.object({
    token: z.string({ required_error: 'token é obrigatório' }),
  }),
})

type Schema = z.infer<typeof schema>

export async function GET(request: NextRequest) {
  return runApiRoute(async () => {
    const http = await NextHttp<Schema>({ request, schema })
    const restClient = await NextApiRestClient(request, { isCacheEnabled: false })
    const authService = AuthService(restClient)
    const controller = ConfirmEmailController(authService)
    return controller.handle(http)
  })
}
