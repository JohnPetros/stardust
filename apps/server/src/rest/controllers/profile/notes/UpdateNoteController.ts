import type { Controller, Http } from '@stardust/core/global/interfaces'
import { UpdateNoteUseCase } from '@stardust/core/profile/use-cases'
import type { NotesRepository } from '@stardust/core/profile/interfaces'

type Schema = {
  routeParams: {
    noteId: string
  }
  body: {
    title: string
    content: string
  }
}

export class UpdateNoteController implements Controller<Schema> {
  constructor(private readonly repository: NotesRepository) {}

  async handle(http: Http<Schema>) {
    const { noteId } = http.getRouteParams()
    const { title, content } = await http.getBody()
    const userId = await http.getAccountId()

    const useCase = new UpdateNoteUseCase(this.repository)
    const response = await useCase.execute({
      noteId,
      noteTitle: title,
      noteContent: content,
      userId,
    })

    return http.statusOk().send(response)
  }
}
