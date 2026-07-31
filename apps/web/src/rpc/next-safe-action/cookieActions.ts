'use server'

import { z } from 'zod'

import { ROUTES } from '@/constants'
import { NextCall } from '../next/NextCall'
import { actionClient } from './clients/actionClient'

const rewardingRouteSchema = z.enum([
  ROUTES.rewarding.star,
  ROUTES.rewarding.starChallenge,
  ROUTES.rewarding.challenge,
])

const setCookie = actionClient
  .inputSchema(
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

const setCookieAndRedirect = actionClient
  .inputSchema(
    z.object({
      key: z.string(),
      value: z.string(),
      durationInSeconds: z.number().default(3600 * 24),
      route: rewardingRouteSchema,
    }),
  )
  .action(async ({ clientInput }) => {
    const call = NextCall()
    await call.setCookie(
      clientInput.key,
      clientInput.value,
      clientInput.durationInSeconds,
    )
    call.redirect(clientInput.route)
  })

const getCookie = actionClient.inputSchema(z.string()).action(async ({ clientInput }) => {
  const call = NextCall()
  return await call.getCookie(clientInput)
})

const deleteCookie = actionClient
  .inputSchema(z.string())
  .action(async ({ clientInput }) => {
    const call = NextCall()
    await call.deleteCookie(clientInput)
  })

const hasCookie = actionClient.inputSchema(z.string()).action(async ({ clientInput }) => {
  const call = NextCall()
  return await call.hasCookie(clientInput)
})

export { setCookie, setCookieAndRedirect, getCookie, deleteCookie, hasCookie }
