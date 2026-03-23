import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'

import type { Call } from '@stardust/core/global/interfaces'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import { AppError } from '@stardust/core/global/errors'

import { SERVER_ENV } from '@/constants/server-env'

type NextCallParams<Request> = {
  request?: Request
  user?: UserDto
}

export const NextCall = <Request = unknown>({
  request,
  user,
}: NextCallParams<Request> = {}): Call<Request> => {
  const isSecureCookie = SERVER_ENV.mode === 'production' || SERVER_ENV.mode === 'staging'

  return {
    getRequest() {
      if (!request) throw new AppError('Action server request undefined')
      return request
    },

    redirect(route: string) {
      redirect(route)
    },

    notFound() {
      notFound()
    },

    async setCookie(key: string, value: string, durationInSeconds?: number) {
      const cookieStore = await cookies()
      cookieStore.set({
        name: key,
        value,
        httpOnly: true,
        sameSite: 'lax',
        secure: isSecureCookie,
        path: '/',
        maxAge: durationInSeconds,
      })
    },

    async getCookie(key) {
      const cookieStore = await cookies()
      return cookieStore.get(key)?.value ?? null
    },

    async hasCookie(key) {
      const cookieStore = await cookies()
      return cookieStore.has(key)
    },

    async deleteCookie(key: string) {
      const cookieStore = await cookies()
      cookieStore.delete(key)
    },

    resetCache(cacheKey) {
      revalidateTag(cacheKey)
    },

    async getUser() {
      if (!user) throw new AppError('Action server user undefined')
      return user
    },
  }
}
