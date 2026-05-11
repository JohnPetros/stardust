import { mock, type Mock } from 'ts-jest-mocker'

import { Id, OrdinalNumber, Text } from '#global/domain/structures/index'
import { PaginationResponse } from '#global/responses/PaginationResponse'
import { NotesFaker } from '#profile/domain/entities/fakers/NotesFaker'
import type { NotesRepository } from '../../interfaces'
import { ListNotesUseCase } from '../ListNotesUseCase'

describe('List Notes Use Case', () => {
  let repository: Mock<NotesRepository>
  let useCase: ListNotesUseCase

  beforeEach(() => {
    repository = mock<NotesRepository>()
    repository.findManyByUser.mockImplementation()
    useCase = new ListNotesUseCase(repository)
  })

  it('should list the user notes with the provided search term', async () => {
    const userId = Id.create()
    const page = 1
    const itemsPerPage = 10
    const search = 'physics'
    repository.findManyByUser.mockResolvedValue({ items: [], count: 0 })

    await useCase.execute({
      userId: userId.value,
      page,
      itemsPerPage,
      search,
    })

    expect(repository.findManyByUser).toHaveBeenCalledWith({
      userId,
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
      search: Text.create(search),
    })
  })

  it('should default the search term to an empty string', async () => {
    const userId = Id.create()
    repository.findManyByUser.mockResolvedValue({ items: [], count: 0 })

    await useCase.execute({
      userId: userId.value,
      page: 1,
      itemsPerPage: 10,
    })

    expect(repository.findManyByUser).toHaveBeenCalledWith({
      userId,
      page: OrdinalNumber.create(1),
      itemsPerPage: OrdinalNumber.create(10),
      search: Text.create(''),
    })
  })

  it('should return a pagination response with note dtos', async () => {
    const notes = NotesFaker.fakeMany(2)
    repository.findManyByUser.mockResolvedValue({
      items: notes,
      count: notes.length,
    })

    const response = await useCase.execute({
      userId: Id.create().value,
      page: 1,
      itemsPerPage: 10,
    })

    expect(response).toEqual(
      new PaginationResponse({
        items: notes.map((note) => note.dto),
        totalItemsCount: notes.length,
        itemsPerPage: 10,
        page: 1,
      }),
    )
  })
})
