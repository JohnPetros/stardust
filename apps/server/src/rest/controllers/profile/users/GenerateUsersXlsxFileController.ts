import type { Controller, Http, XlsxProvider } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'

export class GenerateUsersXlsxFileController implements Controller {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly xlsxProvider: XlsxProvider,
  ) {}

  async handle(http: Http): Promise<RestResponse> {
    const users = await this.usersRepository.findAll()
    const file = await this.xlsxProvider.generateUsersFile(users)
    const fileBuffer = await file.arrayBuffer()

    const response = new Response(fileBuffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${file.name}"`,
      },
    })

    return http.stream(response)
  }
}
