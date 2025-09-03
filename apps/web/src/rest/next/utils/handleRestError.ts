import { RestResponse } from '@stardust/core/global/responses'

import { parseResponseJson } from './parseResponseJson'

export async function handleRestError<Body>(response: globalThis.Response) {
  const data = await parseResponseJson(response)

  console.log('handleRestError', data)

  if (data && 'title' in data && 'message' in data) {
    console.warn('Rest Api error title:', data.title)
    console.warn('Rest Api error message:', data.message)

    return new RestResponse<Body>({
      errorMessage: String(data.message),
      statusCode: response.status,
    })
  }

  return new RestResponse<Body>({ statusCode: response.status })
}
