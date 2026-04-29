import { mock, type Mock } from 'ts-jest-mocker'

import type { Http, XlsxProvider } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'

import { GenerateUsersXlsxFileController } from '../GenerateUsersXlsxFileController'

describe('Generate Users Xlsx File Controller', () => {
  let http: Mock<Http>
  let usersRepository: Mock<UsersRepository>
  let xlsxProvider: Mock<XlsxProvider>
  let controller: GenerateUsersXlsxFileController

  beforeEach(() => {
    http = mock()
    usersRepository = mock()
    xlsxProvider = mock()
    controller = new GenerateUsersXlsxFileController(usersRepository, xlsxProvider)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should fetch users, generate file and stream response with xlsx headers', async () => {
    const users = UsersFaker.fakeMany(2)
    const fileName = 'users-report.xlsx'
    const fileContent = 'xlsx-bytes'
    const file = new File([fileContent], fileName, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const restResponse = mock<RestResponse>()

    usersRepository.findAll.mockResolvedValue(users)
    xlsxProvider.generateUsersFile.mockResolvedValue(file)
    http.stream.mockReturnValue(restResponse)

    const response = await controller.handle(http)

    expect(usersRepository.findAll).toHaveBeenCalled()
    expect(xlsxProvider.generateUsersFile).toHaveBeenCalledWith(users)
    expect(http.stream).toHaveBeenCalled()

    const streamedResponse = http.stream.mock.calls[0]?.[0] as Response

    expect(streamedResponse).toBeInstanceOf(Response)
    expect(streamedResponse.headers.get('Content-Type')).toBe(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    expect(streamedResponse.headers.get('Content-Disposition')).toBe(
      `attachment; filename="${fileName}"`,
    )

    expect(response).toBe(restResponse)
  })
})
