import { Id, OrdinalNumber, Text } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import { PaginationResponse } from '#global/responses/PaginationResponse'
import type { NoteDto } from '../domain/entities/dtos'
import type { NotesRepository } from '../interfaces'

type Request = {
  userId: string
  page: number
  itemsPerPage: number
  search?: string
}

type Response = Promise<PaginationResponse<NoteDto>>

export class ListNotesUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: NotesRepository) {}

  async execute({ userId, page, itemsPerPage, search }: Request): Response {
    const { items, count } = await this.repository.findManyByUser({
      userId: Id.create(userId),
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
      search: Text.create(search ?? ''),
    })

    return new PaginationResponse({
      items: items.map((note) => note.dto),
      totalItemsCount: count,
      itemsPerPage,
      page,
    })
  }
}
