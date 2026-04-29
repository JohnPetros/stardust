import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { Text } from '@stardust/core/global/structures'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import type { StorageFolder } from '@stardust/core/storage/structures'

import { RemoveFileController } from '../RemoveFileController'

describe('Remove File Controller', () => {
  let http: Mock<Http<{ routeParams: { fileName: string; folder: string } }>>
  let storageProvider: Mock<StorageProvider>
  let controller: RemoveFileController

  beforeEach(() => {
    http = mock()
    storageProvider = mock()
    controller = new RemoveFileController(storageProvider)
  })

  it('should extract route params, call provider with domain structures and return no-content', async () => {
    const fileName = 'avatar.png'
    const folder = 'avatars'
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ fileName, folder })
    storageProvider.removeFile.mockResolvedValue(undefined)
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(storageProvider.removeFile).toHaveBeenCalledTimes(1)

    const [storageFolder, text] = storageProvider.removeFile.mock.calls[0] as [
      StorageFolder,
      Text,
    ]

    expect(storageFolder.name).toBe(folder)
    expect(text.value).toBe(fileName)
    expect(http.statusNoContent).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledTimes(1)
    expect(response).toBe(restResponse)
  })
})
