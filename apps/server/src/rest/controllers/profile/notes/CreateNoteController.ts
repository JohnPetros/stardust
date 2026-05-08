import type { Controller, Http } from '@stardust/core/global/interfaces'
import { CreateNoteUseCase } from '@stardust/core/profile/use-cases'
import type { NotesRepository } from '@stardust/core/profile/interfaces'

type Schema = {
  body: {
    title: string
    content: string
  }
}

export class CreateNoteController implements Controller<Schema> {
  constructor(private readonly repository: NotesRepository) {}

  async handle(http: Http<Schema>) {
    const { title, content } = await http.getBody()
    const userId = await http.getAccountId()

    const useCase = new CreateNoteUseCase(this.repository)
    const response = await useCase.execute({
      noteTitle: title,
      noteContent: content,
      userId,
    })

    return http.statusCreated().send(response)
  }
}
