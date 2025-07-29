import axios, { type AxiosError } from 'axios'
import { RestResponse } from '@stardust/core/global/responses'
import { normalizeHeaders } from './normalizeHeaders'

export async function handleError<Body>(error: unknown): Promise<RestResponse<Body>> {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    const status = axiosError.response?.status
    const data = axiosError.response?.data
    const headers = normalizeHeaders(
      axiosError.response?.headers as Record<string, unknown>,
    )
    let errorMessage: string | undefined = axiosError.message

    if (typeof data === 'string') {
      errorMessage = data
    } else if (
      data &&
      typeof data === 'object' &&
      'message' in data &&
      typeof data.message === 'string'
    ) {
      errorMessage = data.message
    }
    return new RestResponse<Body>({
      statusCode: status,
      errorMessage,
      headers,
    })
  }

  console.log('Axios error', error)

  return new RestResponse<Body>({
    statusCode: 500,
    errorMessage: error instanceof Error ? error.message : String(error),
  })
}
