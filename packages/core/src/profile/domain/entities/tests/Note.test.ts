import { Text } from '#global/domain/structures/index'
import { NotesFaker } from '../fakers/NotesFaker'
import { Note } from '../Note'

describe('Note Entity', () => {
  it('should create a note with the provided data', () => {
    const dto = NotesFaker.fakeDto()

    const note = Note.create(dto)

    expect(note.id.value).toBe(dto.id)
    expect(note.title.value).toBe(dto.title)
    expect(note.content.value).toBe(dto.content)
    expect(note.userId.value).toBe(dto.userId)
    expect(note.createdAt).toBe(dto.createdAt)
    expect(note.updatedAt).toBe(dto.updatedAt)
  })

  it('should use the current date when createdAt and updatedAt are not provided', () => {
    const dto = NotesFaker.fakeDto({ createdAt: undefined, updatedAt: undefined })

    const note = Note.create(dto)

    expect(note.createdAt).toBeInstanceOf(Date)
    expect(note.updatedAt).toBeInstanceOf(Date)
  })

  it('should update the title and content', () => {
    const note = NotesFaker.fake()
    const newTitle = Text.create('Updated note title')
    const newContent = Text.create('Updated note content')

    note.updateTitle(newTitle)
    note.updateContent(newContent)

    expect(note.title).toEqual(newTitle)
    expect(note.content).toEqual(newContent)
  })

  it('should update updatedAt when touch is called', () => {
    const note = NotesFaker.fake()
    const updatedAt = new Date('2026-05-08T12:00:00.000Z')

    note.touch(updatedAt)

    expect(note.updatedAt).toEqual(updatedAt)
  })

  it('should serialize the note to dto', () => {
    const note = NotesFaker.fake()

    expect(note.dto).toEqual({
      id: note.id.value,
      title: note.title.value,
      content: note.content.value,
      userId: note.userId.value,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    })
  })
})
