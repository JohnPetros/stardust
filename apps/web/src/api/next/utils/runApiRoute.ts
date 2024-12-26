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
import type { ApiResponse } from '@stardust/core/responses'

export async function runApiRoute(
  apiRoute: () => Promise<ApiResponse>,
): Promise<unknown> {
  const http = await NextHttp()

  try {
    const response = await apiRoute()
    return response.body
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = ZodValidationErrorFactory.produce(error)

      return http.send(
        {
          title: validationError.title,
          fieldErrors: validationError.fieldErrors,
        },
        HTTP_STATUS_CODE.badRequest,
      ).body
    }

    if (error instanceof AppError) {
      const response = { title: error.title, message: error.message }

      if (error instanceof AuthError) {
        return http.send(response, HTTP_STATUS_CODE.unauthorized).body
      }

      if (error instanceof NotFoundError) {
        return http.send(response, HTTP_STATUS_CODE.notFound).body
      }

      if (error instanceof ConflictError) {
        return http.send(response, HTTP_STATUS_CODE.conflict).body
      }

      if (error instanceof ValidationError) {
        return http.send(response, HTTP_STATUS_CODE.badRequest).body
      }

      return http.send(response, HTTP_STATUS_CODE.serverError).body
    }
    return http.send(
      {
        title: 'Unknown Api Error',
        message:
          'Contate esse e-mail joaopcarvalho.cds@gmail.com imediatamente, pois se você está vendo essa mensagem algo muito deu errado',
      },
      HTTP_STATUS_CODE.serverError,
    ).body
  }
}
