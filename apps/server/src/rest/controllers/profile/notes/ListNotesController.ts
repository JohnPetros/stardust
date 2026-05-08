import type { Controller, Http } from '@stardust/core/global/interfaces'
import { ListNotesUseCase } from '@stardust/core/profile/use-cases'
import type { NotesRepository } from '@stardust/core/profile/interfaces'

type Schema = {
  queryParams: {
    page: number
    itemsPerPage: number
    search: string
  }
}

export class ListNotesController implements Controller<Schema> {
  constructor(private readonly repository: NotesRepository) {}

  async handle(http: Http<Schema>) {
    const { page, itemsPerPage, search } = http.getQueryParams()
    const userId = await http.getAccountId()

    const useCase = new ListNotesUseCase(this.repository)
    const response = await useCase.execute({
      userId,
      page,
      itemsPerPage,
      search,
    })

    return http.sendPagination(response)
  }
}
