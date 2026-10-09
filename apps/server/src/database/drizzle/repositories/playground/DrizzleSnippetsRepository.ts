import { and, eq, getTableColumns, or, sql, type SQL } from 'drizzle-orm'
import type { Snippet } from '@stardust/core/playground/entities'
import type { SnippetsRepository } from '@stardust/core/playground/interfaces'
import type { SnippetsListParams } from '@stardust/core/playground/types'
import type { Id } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { snippetModel } from '../../models/playground/snippet-model'
import { userModel } from '../../models/profile/user-model'
import { avatarModel } from '../../models/shop/avatar-model'
import { DrizzleSnippetMapper } from '../../mappers/playground'

export class DrizzleSnippetsRepository
  extends DrizzleRepository
  implements SnippetsRepository
{
  private ownerCondition(): SQL | undefined {
    if (this.access.kind === 'public') throw new AuthError('Conta não autorizada')
    return this.access.kind === 'user'
      ? eq(snippetModel.userId, this.access.accountId.value)
      : undefined
  }

  private visibilityCondition(): SQL | undefined {
    if (this.access.kind === 'god' || this.access.kind === 'system') return undefined
    return this.access.kind === 'user'
      ? this.userVisibility(this.access.accountId)
      : eq(snippetModel.isPublic, true)
  }

  private userVisibility(accountId: Id) {
    return or(eq(snippetModel.isPublic, true), eq(snippetModel.userId, accountId.value))
  }

  private readColumns() {
    return { ...getTableColumns(snippetModel), ...this.authorColumns() }
  }

  private authorColumns() {
    return {
      authorId: userModel.id,
      authorName: userModel.name,
      authorSlug: userModel.slug,
      authorAvatarName: avatarModel.name,
      authorAvatarImage: avatarModel.image,
    }
  }

  private readQuery() {
    return this.database
      .select(this.readColumns())
      .from(snippetModel)
      .leftJoin(userModel, eq(userModel.id, snippetModel.userId))
      .leftJoin(avatarModel, eq(avatarModel.id, userModel.avatarId))
  }

  async findById(snippetId: Id): Promise<Snippet | null> {
    return this.findOneResult(
      async () =>
        this.readQuery()
          .where(and(eq(snippetModel.id, snippetId.value), this.visibilityCondition()))
          .limit(1),
      DrizzleSnippetMapper.toEntity,
    )
  }

  async findManySnippets(params: SnippetsListParams): Promise<ManyItems<Snippet>> {
    return this.executeQuery(() => this.listPage(params))
  }

  private pageFilter(params: SnippetsListParams) {
    return and(eq(snippetModel.userId, params.authorId.value), this.visibilityCondition())
  }

  private pageRowsQuery(filter: SQL | undefined, params: SnippetsListParams) {
    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)
    return this.readQuery().where(filter).offset(range.offset).limit(range.limit)
  }

  private countQuery(filter: SQL | undefined) {
    return this.database
      .select({ count: sql<number>`count(*)::integer` })
      .from(snippetModel)
      .where(filter)
  }

  private async listPage(params: SnippetsListParams): Promise<ManyItems<Snippet>> {
    const filter = this.pageFilter(params)
    const [rows, [total]] = await Promise.all([
      this.pageRowsQuery(filter, params),
      this.countQuery(filter),
    ])
    return this.mapPage(rows, total)
  }

  private mapPage(
    rows: Awaited<ReturnType<DrizzleSnippetsRepository['readQuery']>>,
    total:
      | Awaited<ReturnType<DrizzleSnippetsRepository['countQuery']>>[number]
      | undefined,
  ): ManyItems<Snippet> {
    return { items: rows.map(DrizzleSnippetMapper.toEntity), count: total?.count ?? 0 }
  }

  private authorizeAuthor(authorId: Id): void {
    this.ownerCondition()
    if (this.access.kind === 'user' && this.access.accountId.value !== authorId.value)
      throw new AuthError('Conta não autorizada')
  }

  async add(snippet: Snippet): Promise<void> {
    this.authorizeAuthor(snippet.authorId)
    await this.executeQuery(async () => {
      await this.database
        .insert(snippetModel)
        .values(DrizzleSnippetMapper.toPersistence(snippet))
    })
  }

  private replacementData(
    snippet: Snippet,
  ): Pick<typeof snippetModel.$inferInsert, 'title' | 'code' | 'isPublic'> {
    return {
      title: snippet.title.value,
      code: snippet.code.value,
      isPublic: snippet.isPublic.value,
    }
  }

  async replace(snippet: Snippet): Promise<void> {
    const owner = this.ownerCondition()
    await this.executeQuery(async () => {
      await this.database
        .update(snippetModel)
        .set(this.replacementData(snippet))
        .where(and(eq(snippetModel.id, snippet.id.value), owner))
    })
  }

  async remove(snippetId: Id): Promise<void> {
    const owner = this.ownerCondition()
    await this.executeQuery(async () => {
      await this.database
        .delete(snippetModel)
        .where(and(eq(snippetModel.id, snippetId.value), owner))
    })
  }
}
