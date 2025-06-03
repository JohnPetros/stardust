import { RestResponse } from '@stardust/core/global/responses'

export async function handleApiError<Body>(response: globalThis.Response) {
  const data = await response.json()

  if ('title' in data && 'message' in data) {
    console.error('Api error: ', data.title)

    return new RestResponse<Body>({
      errorMessage: String(data.message),
      statusCode: response.status,
    })
  }

  console.error('Unkown Api error: ', response)

  return new RestResponse<Body>({ statusCode: response.status })
}
