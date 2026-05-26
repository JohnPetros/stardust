import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { Text } from '@stardust/core/global/structures'
import type { FileStorageProvider } from '@stardust/core/storage/interfaces'
import type { FileStorageFolderPath } from '@stardust/core/storage/structures'

import { RemoveFileController } from '../RemoveFileController'

describe('Remove File Controller', () => {
  const INTERNAL_FOLDER_NAMES = {
    avatars: 'images/avatars',
  } as const

  let http: Mock<Http<{ queryParams: { fileName: string; folder: string } }>>
  let storageProvider: Mock<FileStorageProvider>
  let controller: RemoveFileController

  beforeEach(() => {
    http = mock()
    storageProvider = mock()
    controller = new RemoveFileController(storageProvider)
  })

  it('should extract query params, call provider with domain structures and return no-content', async () => {
    const fileName = 'avatar.png'
    const folder = 'avatars'
    const restResponse = mock<RestResponse>()

    http.getQueryParams.mockReturnValue({ fileName, folder })
    storageProvider.removeFile.mockResolvedValue(undefined)
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(http.getQueryParams).toHaveBeenCalledTimes(1)
    expect(storageProvider.removeFile).toHaveBeenCalledTimes(1)

    const [FileStorageFolderPath, text] = storageProvider.removeFile.mock.calls[0] as [
      FileStorageFolderPath,
      Text,
    ]

    expect(FileStorageFolderPath.value).toBe(INTERNAL_FOLDER_NAMES[folder])
    expect(text.value).toBe(fileName)
    expect(http.statusNoContent).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledTimes(1)
    expect(response).toBe(restResponse)
  })
})
