import type { CommentsRepository } from '@stardust/core/forum/interfaces'
import type { Comment } from '@stardust/core/forum/entities'
import type { CommentsListParams } from '@stardust/core/forum/types'
import type { Id } from '@stardust/core/global/structures'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'
import { SupabaseCommentMapper } from '../../mappers/forum'

export class SupabaseCommentsRepository
  extends SupabaseRepository
  implements CommentsRepository
{
  async findById(commentId: Id): Promise<Comment | null> {
    const { data, error } = await this.supabase
      .from('comments_view')
      .select('*')
      .eq('id', commentId.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseCommentMapper.toEntity(data)
  }

  async findManyByChallenge(
    challengeId: Id,
    params: CommentsListParams,
  ): Promise<{ comments: Comment[]; totalCommentsCount: number }> {
    let query = this.supabase
      .from('comments_view')
      .select('*, challenges_comments!inner(challenge_id)', { count: 'exact' })

    if (params.sorter.isByDate.isTrue) {
      query = query.order('created_at', { ascending: params.order.isAscending.isTrue })
    } else if (params.sorter.isByUpvotes.isTrue) {
      query = query.order('upvotes_count', { ascending: params.order.isAscending.isTrue })
    }

    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)

    const { data, count, error } = await query
      .eq('challenges_comments.challenge_id', challengeId.value)
      .is('parent_comment_id', null)
      .range(range.from, range.to)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const comments = data.map(SupabaseCommentMapper.toEntity)

    return {
      comments,
      totalCommentsCount: Number(count),
    }
  }

  async findManyBySolution(
    solutionId: Id,
    params: CommentsListParams,
  ): Promise<{ comments: Comment[]; totalCommentsCount: number }> {
    let query = this.supabase
      .from('comments_view')
      .select('*, challenges_comments!inner(challenge_id)', { count: 'exact' })

    if (params.sorter.isByDate.isTrue) {
      query = query.order('created_at', { ascending: params.order.isAscending.isTrue })
    } else if (params.sorter.isByUpvotes.isTrue) {
      query = query.order('upvotes_count', { ascending: params.order.isAscending.isTrue })
    }

    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)

    const { data, count, error } = await query
      .eq('solutions_comments.solution_id', solutionId.value)
      .is('parent_comment_id', null)
      .range(range.from, range.to)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const comments = data.map(SupabaseCommentMapper.toEntity)

    return {
      comments,
      totalCommentsCount: Number(count),
    }
  }

  async findAllRepliesByComment(commentId: Id): Promise<Comment[]> {
    const { data, error } = await this.supabase
      .from('comments_view')
      .select('*')
      .eq('parent_comment_id', commentId.value)
      .order('created_at', { ascending: false })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseCommentMapper.toEntity)
  }

  async addByChallenge(comment: Comment, challengeId: Id): Promise<void> {
    const supabaseComment = SupabaseCommentMapper.toSupabase(comment)

    const { error: commentError } = await this.supabase.from('comments').insert({
      // @ts-ignore
      id: comment.id.value,
      content: supabaseComment.content,
      user_id: supabaseComment.author_id,
      parent_comment_id: null,
    })

    if (commentError) {
      throw new SupabasePostgreError(commentError)
    }

    const { error: challengeCommentError } = await this.supabase
      .from('challenges_comments')
      .insert({ comment_id: comment.id.value, challenge_id: challengeId.value })

    if (challengeCommentError) {
      throw new SupabasePostgreError(challengeCommentError)
    }
  }

  async addBySolution(comment: Comment, solutionId: Id): Promise<void> {
    const supabaseComment = SupabaseCommentMapper.toSupabase(comment)

    const { error: commentError } = await this.supabase.from('comments').insert({
      // @ts-ignore
      id: comment.id.value,
      content: supabaseComment.content,
      user_id: supabaseComment.author_id,
    })

    if (commentError) {
      throw new SupabasePostgreError(commentError)
    }

    const { error: solutionCommentError } = await this.supabase
      .from('solutions_comments')
      .insert({ comment_id: comment.id.value, solution_id: solutionId.value })

    if (solutionCommentError) {
      throw new SupabasePostgreError(solutionCommentError)
    }
  }

  async addReply(reply: Comment, commentId: Id): Promise<void> {
    const supabaseReply = SupabaseCommentMapper.toSupabase(reply)

    const { error } = await this.supabase.from('comments').insert({
      // @ts-ignore
      id: reply.id.value,
      content: supabaseReply.content,
      user_id: supabaseReply.author_id,
      parent_comment_id: commentId.value,
    })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replace(comment: Comment): Promise<void> {
    const { error } = await this.supabase
      .from('comments')
      .update({
        content: comment.content.value,
      })
      .eq('id', comment.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async remove(commentId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('comments')
      .delete()
      .eq('id', commentId.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
