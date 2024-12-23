import { z } from 'zod'

import { NextActionServer } from '../next/NextActionServer'
import { actionClient } from './clients/actionClient'

const setCookie = actionClient
  .schema(
    z.object({
      key: z.string(),
      value: z.string(),
      duration: z.number().default(3600 * 24), // 1 day
    }),
  )
  .action(async ({ clientInput }) => {
    const actionServer = NextActionServer()
    actionServer.setCookie(clientInput.key, clientInput.value, clientInput.duration)
  })

const getCookie = actionClient.schema(z.string()).action(async ({ clientInput }) => {
  const actionServer = NextActionServer()
  return actionServer.getCookie(clientInput)
})

const deleteCookie = actionClient.schema(z.string()).action(async ({ clientInput }) => {
  const actionServer = NextActionServer()
  actionServer.getCookie(clientInput)
})

export const cookieActions = { setCookie, getCookie, deleteCookie }
