'use server'

import { z } from 'zod'

import { NextActionServer } from '../next/NextActionServer'
import { actionClient } from './clients/actionClient'

const setCookie = actionClient
  .schema(
    z.object({
      key: z.string(),
      value: z.string(),
      expirationInSeconds: z.number().default(3600 * 24), // 1 day
    }),
  )
  .action(async ({ clientInput }) => {
    const actionServer = NextActionServer()
    await actionServer.setCookie(
      clientInput.key,
      clientInput.value,
      clientInput.expirationInSeconds,
    )
  })

const getCookie = actionClient.schema(z.string()).action(async ({ clientInput }) => {
  const actionServer = NextActionServer()
  return actionServer.getCookie(clientInput)
})

const deleteCookie = actionClient.schema(z.string()).action(async ({ clientInput }) => {
  const actionServer = NextActionServer()
  await actionServer.deleteCookie(clientInput)
})

const hasCookie = actionClient.schema(z.string()).action(async ({ clientInput }) => {
  const actionServer = NextActionServer()
  return await actionServer.hasCookie(clientInput)
})

export { setCookie, getCookie, deleteCookie, hasCookie }
