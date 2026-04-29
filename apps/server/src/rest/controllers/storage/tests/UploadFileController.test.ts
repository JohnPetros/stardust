import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import { StorageFolder } from '@stardust/core/storage/structures'
import { UploadFileController } from '../UploadFileController'

describe('Upload File Controller', () => {
  let http: Mock<Http<{ routeParams: { folder: string } }>>
  let storageProvider: Mock<StorageProvider>
  let controller: UploadFileController

  beforeEach(() => {
    http = mock()
    storageProvider = mock()
    controller = new UploadFileController(storageProvider)
    http.statusCreated.mockReturnValue(http)
  })

  it('should extract route param and file, upload and return created response with filename', async () => {
    const folder = 'avatars'
    const file = { name: 'avatar.png' }
    const uploadedFile = { name: 'stored-avatar.png' }
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ folder })
    http.getFile.mockResolvedValue(file as any)
    storageProvider.upload.mockResolvedValue(uploadedFile as any)
    http.send.mockReturnValue(restResponse)

    const result = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(http.getFile).toHaveBeenCalledTimes(1)
    expect(storageProvider.upload).toHaveBeenCalledTimes(1)
    expect(storageProvider.upload).toHaveBeenCalledWith(
      StorageFolder.create(folder),
      file,
    )
    expect(http.statusCreated).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith({ filename: uploadedFile.name })
    expect(result).toBe(restResponse)
  })
})
