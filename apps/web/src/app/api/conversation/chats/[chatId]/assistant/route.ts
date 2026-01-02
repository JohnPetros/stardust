import type { NextRequest } from 'next/server'
import { z } from 'zod'

import { idSchema, stringSchema } from '@stardust/validation/global/schemas'

import type { NextParams } from '@/rpc/next/types'
import { NextHttp } from '@/rest/next/NextHttp'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { runApiRoute } from '@/rest/next/utils'
import { ConversationService } from '@/rest/services'
import { AskAssistantController } from '@/rest/controllers/conversation'
import { VercelManualWorkflow } from '@/ai/vercel/workflows/VercelManualWorkflow'

const schema = z.object({
  routeParams: z.object({
    chatId: idSchema,
  }),
  body: z.object({
    question: stringSchema,
    challengeId: idSchema,
  }),
})

type Schema = z.infer<typeof schema>

export const POST = async (request: NextRequest, params: NextParams<'chatId'>) => {
  return await runApiRoute(async () => {
    const http = await NextHttp<Schema>({ request, schema, params })
    const restClient = await NextServerRestClient()
    const service = ConversationService(restClient)
    const workflow = VercelManualWorkflow()
    const controller = AskAssistantController({ service, workflow })
    return await controller.handle(http)
  })
}
