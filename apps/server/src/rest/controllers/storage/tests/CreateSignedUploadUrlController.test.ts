import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { CreateSignedUploadUrl } from '@stardust/core/storage/use-cases'

import { CreateSignedUploadUrlController } from '../CreateSignedUploadUrlController'

describe('Create Signed Upload Url Controller', () => {
  type Schema = {
    body: {
      folderPath: string
      fileName: string
    }
  }

  let http: Mock<Http<Schema>>
  let createSignedUploadUrl: Mock<CreateSignedUploadUrl>
  let controller: CreateSignedUploadUrlController

  beforeEach(() => {
    http = mock()
    createSignedUploadUrl = mock<CreateSignedUploadUrl>()
    controller = new CreateSignedUploadUrlController(createSignedUploadUrl)

    http.statusOk.mockReturnValue(http)
  })

  it('should read the body, delegate to the use case and send the ok response', async () => {
    const body = {
      folderPath: 'images/story',
      fileName: 'cover.png',
    }
    const signedUploadUrl = {
      url: 'https://storage.stardust.dev/upload',
      folderPath: 'images/story',
      fileName: 'cover.png',
    }
    const response = mock<RestResponse>()

    http.getBody.mockResolvedValue(body)
    createSignedUploadUrl.execute.mockResolvedValue(signedUploadUrl)
    http.send.mockReturnValue(response)

    const result = await controller.handle(http)

    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(createSignedUploadUrl.execute).toHaveBeenCalledWith(body)
    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(signedUploadUrl)
    expect(result).toBe(response)
  })
})
