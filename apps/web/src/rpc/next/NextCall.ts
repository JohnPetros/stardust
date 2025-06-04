import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import type { Call } from '@stardust/core/global/interfaces'
import { AppError } from '@stardust/core/global/errors'
import type { UserDto } from '@stardust/core/profile/entities/dtos'

type NextCallParams<Request> = {
  request?: Request
  user?: UserDto
}

export const NextCall = <Request = unknown>({
  request,
  user,
}: NextCallParams<Request> = {}): Call<Request> => {
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
      cookies().set({
        name: key,
        value,
        httpOnly: true,
        path: '/',
        maxAge: durationInSeconds,
      })
    },

    async getCookie(key) {
      return cookies().get(key)?.value ?? null
    },

    async hasCookie(key) {
      return cookies().has(key)
    },

    async deleteCookie(key: string) {
      cookies().delete(key)
    },

    async getUser() {
      if (!user) throw new AppError('Action server user undefined')
      return user
    },
  }
}
