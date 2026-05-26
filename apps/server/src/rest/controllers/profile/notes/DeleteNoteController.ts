import type { Controller, Http } from '@stardust/core/global/interfaces'
import { DeleteNoteUseCase } from '@stardust/core/profile/use-cases'
import type { NotesRepository } from '@stardust/core/profile/interfaces'

type Schema = {
  routeParams: {
    noteId: string
  }
}

export class DeleteNoteController implements Controller<Schema> {
  constructor(private readonly repository: NotesRepository) {}

  async handle(http: Http<Schema>) {
    const { noteId } = http.getRouteParams()
    const userId = await http.getAccountId()

    const useCase = new DeleteNoteUseCase(this.repository)
    const response = await useCase.execute({ noteId, userId })
    return http.statusOk().send(response)
  }
}
