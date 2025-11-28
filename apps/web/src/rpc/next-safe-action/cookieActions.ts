'use server'

import { z } from 'zod'

import { NextCall } from '../next/NextCall'
import { actionClient } from './clients/actionClient'

const setCookie = actionClient
  .schema(
    z.object({
      key: z.string(),
      value: z.string(),
      durationInSeconds: z.number().default(3600 * 24), // 1 day
    }),
  )
  .action(async ({ clientInput }) => {
    const call = NextCall()
    await call.setCookie(
      clientInput.key,
      clientInput.value,
      clientInput.durationInSeconds,
    )
  })

const getCookie = actionClient.schema(z.string()).action(async ({ clientInput }) => {
  const call = NextCall()
  return await call.getCookie(clientInput)
})

const deleteCookie = actionClient.schema(z.string()).action(async ({ clientInput }) => {
  const call = NextCall()
  await call.deleteCookie(clientInput)
})

const hasCookie = actionClient.schema(z.string()).action(async ({ clientInput }) => {
  const call = NextCall()
  return await call.hasCookie(clientInput)
})

export { setCookie, getCookie, deleteCookie, hasCookie }
