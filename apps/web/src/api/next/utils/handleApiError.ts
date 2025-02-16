import { ApiResponse } from '@stardust/core/responses'

export async function handleApiError<Body>(response: globalThis.Response) {
  const data = await response.json()

  if ('title' in data && 'message' in data) {
    console.error('Api error: ', data.title)

    return new ApiResponse<Body>({
      errorMessage: String(data.message),
      statusCode: response.status,
    })
  }

  console.error('Unkown Api error: ', response)

  return new ApiResponse<Body>({ statusCode: response.status })
}
