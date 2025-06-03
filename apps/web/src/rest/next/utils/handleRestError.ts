import { RestResponse } from '@stardust/core/global/responses'

import { parseResponseJson } from './parseResponseJson'

export async function handleRestError<Body>(response: globalThis.Response) {
  const data = await parseResponseJson(response)

  if (data && 'title' in data && 'message' in data) {
    console.error('Rest Api error title:', data.title)
    console.error('Rest Api error message:', data.message)

    return new RestResponse<Body>({
      errorMessage: String(data.message),
      statusCode: response.status,
    })
  }

  return new RestResponse<Body>({ statusCode: response.status })
}
