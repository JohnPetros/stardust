import { Snippet } from '@stardust/core/playground/entities'
import type {
  DrizzleSnippet,
  DrizzleInsertSnippet,
} from '../../types/entities/playground'

export class DrizzleSnippetMapper {
  static toEntity(row: DrizzleSnippet): Snippet {
    return Snippet.create({
      ...DrizzleSnippetMapper.content(row),
      ...DrizzleSnippetMapper.metadata(row),
      author: DrizzleSnippetMapper.author(row),
    })
  }
  private static author(row: DrizzleSnippet): Snippet['dto']['author'] {
    return {
      id: row.authorId ?? '',
      entity: DrizzleSnippetMapper.authorEntity(row),
    }
  }
  private static authorEntity(row: DrizzleSnippet) {
    const { slug, name } = DrizzleSnippetMapper.authorIdentity(row)
    return { slug, name, avatar: DrizzleSnippetMapper.avatar(row) }
  }
  private static avatar(row: DrizzleSnippet) {
    return { name: row.authorAvatarName ?? '', image: row.authorAvatarImage ?? '' }
  }
  static toPersistence(snippet: Snippet): DrizzleInsertSnippet {
    return {
      id: snippet.id.value,
      userId: snippet.authorId.value,
      ...DrizzleSnippetMapper.persistenceContent(snippet),
      createdAt: snippet.createdAt,
    }
  }
  private static content(row: DrizzleSnippet): Pick<Snippet['dto'], 'code' | 'title'> {
    return {
      code: row.code ?? '',
      title: row.title ?? '',
    }
  }
  private static metadata(
    row: DrizzleSnippet,
  ): Pick<Snippet['dto'], 'id' | 'isPublic' | 'createdAt'> {
    return { id: row.id, isPublic: row.isPublic ?? true, createdAt: row.createdAt }
  }
  private static authorIdentity(row: DrizzleSnippet) {
    return {
      slug: row.authorSlug ?? '',
      name: row.authorName ?? '',
    }
  }
  private static persistenceContent(
    snippet: Snippet,
  ): Pick<DrizzleInsertSnippet, 'isPublic' | 'title' | 'code'> {
    return {
      isPublic: snippet.isPublic.value,
      title: snippet.title.value,
      code: snippet.code.value,
    }
  }
}
