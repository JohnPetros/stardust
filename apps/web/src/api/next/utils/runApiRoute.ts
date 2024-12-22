import type { NextResponse } from 'next/server'
import { ZodError } from 'zod'

import { HTTP_STATUS_CODE } from '@stardust/core/constants'
import {
  AppError,
  AuthError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@stardust/core/global/errors'
import { ZodValidationErrorFactory } from '@stardust/validation/factories'

import { NextHttp } from '../NextHttp'

export async function runApiRoute(apiRoute: () => Promise<unknown>): Promise<unknown> {
  const http = await NextHttp()

  try {
    return await apiRoute()
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = ZodValidationErrorFactory.produce(error)

      return http.send(
        {
          title: validationError.title,
          fieldErrors: validationError.fieldErrors,
        },
        HTTP_STATUS_CODE.badRequest,
      )
    }

    if (error instanceof AppError) {
      const response = { title: error.title, message: error.message }

      if (error instanceof AuthError) {
        return http.send(response, HTTP_STATUS_CODE.unauthorized)
      }

      if (error instanceof NotFoundError) {
        return http.send(response, HTTP_STATUS_CODE.notFound)
      }

      if (error instanceof ConflictError) {
        return http.send(response, HTTP_STATUS_CODE.conflict)
      }

      if (error instanceof ValidationError) {
        return http.send(response, HTTP_STATUS_CODE.badRequest)
      }

      return http.send(response, HTTP_STATUS_CODE.serverError)
    }
  }
}
