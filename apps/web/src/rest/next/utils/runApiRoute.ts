import { ZodError } from 'zod'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import {
  AppError,
  AuthError,
  ConflictError,
  NotAllowedError,
  NotFoundError,
  ValidationError,
} from '@stardust/core/global/errors'
import { ZodValidationErrorFactory } from '@stardust/validation/factories'

import { NextHttp } from '../NextHttp'
import type { RestResponse } from '@stardust/core/global/responses'

export async function runApiRoute(
  apiRoute: () => Promise<RestResponse>,
): Promise<Response> {
  const http = await NextHttp()

  try {
    const response = await apiRoute()
    return response.body as Response
  } catch (error) {
    console.error(error)

    if (error instanceof ZodError) {
      const validationError = ZodValidationErrorFactory.produce(error)

      return http.sendJson(
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
        return http.sendJson(response, HTTP_STATUS_CODE.unauthorized).body
      }

      if (error instanceof NotFoundError) {
        return http.sendJson(response, HTTP_STATUS_CODE.notFound).body
      }

      if (error instanceof NotAllowedError) {
        return http.sendJson(response, HTTP_STATUS_CODE.forbidden).body
      }

      if (error instanceof ConflictError) {
        return http.sendJson(response, HTTP_STATUS_CODE.conflict).body
      }

      if (error instanceof ValidationError) {
        return http.sendJson(response, HTTP_STATUS_CODE.badRequest).body
      }

      return http.sendJson(response, HTTP_STATUS_CODE.serverError).body
    }

    return http.sendJson(
      {
        title: 'Unknown Api Error',
        message:
          'Contate esse e-mail joaopcarvalho.cds@gmail.com imediatamente, pois se você está vendo essa mensagem algo deu muito errado',
      },
      HTTP_STATUS_CODE.serverError,
    ).body
  }
}
