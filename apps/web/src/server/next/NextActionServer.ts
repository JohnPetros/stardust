import { notFound, redirect } from 'next/navigation'

import type { IActionServer } from '@stardust/core/interfaces'
import { AppError } from '@stardust/core/global/errors'
import type { UserDto } from '@stardust/core/global/dtos'
import { cookies } from 'next/headers'

type NextActionServerParams<Request> = {
  request?: Request
  user?: UserDto
}

export const NextActionServer = <Request = unknown>({
  request,
  user,
}: NextActionServerParams<Request> = {}): IActionServer<Request> => {
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

    async setCookie(key, value) {
      cookies().set({
        name: key,
        value,
        httpOnly: true,
        path: '/',
      })
    },

    async getCookie(key) {
      return cookies().get(key)?.value ?? null
    },

    async deleteCookie(key) {
      cookies().delete(key)
    },

    async getUser() {
      if (!user) throw new AppError('Action server user undefined')
      return user
    },
  }
}
