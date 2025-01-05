'use server'

import { z } from 'zod'

import { NextActionServer } from '../next/NextActionServer'
import { authActionClient } from './clients/authActionClient'

const setCookie = authActionClient
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

const getCookie = authActionClient.schema(z.string()).action(async ({ clientInput }) => {
  const actionServer = NextActionServer()
  return actionServer.getCookie(clientInput)
})

const deleteCookie = authActionClient
  .schema(z.string())
  .action(async ({ clientInput }) => {
    const actionServer = NextActionServer()
    actionServer.deleteCookie(clientInput)
  })

const hasCookie = authActionClient.schema(z.string()).action(async ({ clientInput }) => {
  const actionServer = NextActionServer()
  actionServer.deleteCookie(clientInput)
})

export { setCookie, getCookie, deleteCookie, hasCookie }
