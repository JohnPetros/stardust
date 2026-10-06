import { and, desc, eq, ilike, sql, type SQL } from 'drizzle-orm'
import type { Note } from '@stardust/core/profile/entities'
import type { NotesRepository } from '@stardust/core/profile/interfaces'
import type { Id } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { noteModel } from '../../models/profile/note-model'
import { DrizzleNoteMapper } from '../../mappers/profile/DrizzleNoteMapper'

export class DrizzleNotesRepository extends DrizzleRepository implements NotesRepository {
  private ownerCondition(): SQL | undefined {
    if (this.access.kind === 'public') throw new AuthError('Conta não autorizada')
    return this.access.kind === 'user'
      ? eq(noteModel.userId, this.access.accountId.value)
      : undefined
  }

  private authorizeOwner(userId: Id): void {
    this.ownerCondition()
    if (this.access.kind === 'user' && this.access.accountId.value !== userId.value)
      throw new AuthError('Conta não autorizada')
  }

  async findById(noteId: Id): Promise<Note | null> {
    const owner = this.ownerCondition()
    return this.findOneResult(
      async () =>
        this.database
          .select()
          .from(noteModel)
          .where(and(eq(noteModel.id, noteId.value), owner))
          .limit(1),
      DrizzleNoteMapper.toEntity,
    )
  }

  async findManyByUser(
    params: Parameters<NotesRepository['findManyByUser']>[0],
  ): Promise<ManyItems<Note>> {
    this.authorizeOwner(params.userId)
    return this.executeQuery(() => this.listPage(params))
  }

  private listingFilter(params: Parameters<NotesRepository['findManyByUser']>[0]) {
    return and(
      eq(noteModel.userId, params.userId.value),
      ilike(noteModel.title, `%${params.search.value}%`),
    )
  }

  private pageRowsQuery(
    filter: SQL | undefined,
    params: Parameters<NotesRepository['findManyByUser']>[0],
  ) {
    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)
    return this.orderedRowsQuery(filter).offset(range.offset).limit(range.limit)
  }

  private orderedRowsQuery(filter: SQL | undefined) {
    return this.database
      .select()
      .from(noteModel)
      .where(filter)
      .orderBy(desc(noteModel.updatedAt))
  }

  private countQuery(filter: SQL | undefined) {
    return this.database
      .select({ count: sql<number>`count(*)::integer` })
      .from(noteModel)
      .where(filter)
  }

  private async listPage(
    params: Parameters<NotesRepository['findManyByUser']>[0],
  ): Promise<ManyItems<Note>> {
    const filter = this.listingFilter(params)
    const [rows, [total]] = await Promise.all([
      this.pageRowsQuery(filter, params),
      this.countQuery(filter),
    ])
    return this.mapPage(rows, total)
  }

  private mapPage(
    rows: (typeof noteModel.$inferSelect)[],
    total: Awaited<ReturnType<DrizzleNotesRepository['countQuery']>>[number] | undefined,
  ): ManyItems<Note> {
    return { items: rows.map(DrizzleNoteMapper.toEntity), count: total?.count ?? 0 }
  }

  async add(note: Note): Promise<void> {
    this.authorizeOwner(note.userId)
    await this.executeQuery(async () => {
      await this.database.insert(noteModel).values(DrizzleNoteMapper.toPersistence(note))
    })
  }

  async replace(note: Note): Promise<void> {
    this.authorizeOwner(note.userId)
    const owner = this.ownerCondition()
    await this.executeQuery(async () => {
      await this.database
        .update(noteModel)
        .set(this.replacementData(note))
        .where(and(eq(noteModel.id, note.id.value), owner))
    })
  }

  private replacementData(
    note: Note,
  ): Pick<typeof noteModel.$inferInsert, 'title' | 'content' | 'updatedAt'> {
    return {
      title: note.title.value,
      content: note.content.value,
      updatedAt: note.updatedAt,
    }
  }

  async remove(noteId: Id): Promise<void> {
    const owner = this.ownerCondition()
    await this.executeQuery(async () => {
      await this.database
        .delete(noteModel)
        .where(and(eq(noteModel.id, noteId.value), owner))
    })
  }
}
