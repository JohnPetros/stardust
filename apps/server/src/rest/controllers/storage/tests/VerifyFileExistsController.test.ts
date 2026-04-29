import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { StorageProvider } from '@stardust/core/storage/interfaces'
import { VerifyFileExistsUseCase } from '@stardust/core/storage/use-cases'
import { VerifyFileExistsController } from '../VerifyFileExistsController'

describe('Verify File Exists Controller', () => {
  let http: Mock<Http<any>>
  let storageProvider: Mock<StorageProvider>
  let controller: VerifyFileExistsController

  beforeEach(() => {
    http = mock()
    storageProvider = mock()
    controller = new VerifyFileExistsController('avatars', storageProvider)
    jest.restoreAllMocks()
  })

  it('should read body, execute use case with folder and fileName, and call http.pass', async () => {
    const body = { fileName: 'avatar.png' }
    const executeSpy = jest
      .spyOn(VerifyFileExistsUseCase.prototype, 'execute')
      .mockResolvedValue(true)
    http.getBody.mockResolvedValue(body)
    http.pass.mockResolvedValue(mock<RestResponse>())

    await controller.handle(http)

    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({
      folder: 'avatars',
      fileName: body.fileName,
    })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })
})
