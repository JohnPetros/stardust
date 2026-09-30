import { ConflictError, NotFoundError } from '@stardust/core/global/errors'
import type { ManyItems } from '@stardust/core/global/types'
import type { Email, Id, OrdinalNumber } from '@stardust/core/global/structures'
import { Email as EmailValue } from '@stardust/core/global/structures'
import type { FeedbackReport } from '@stardust/core/reporting/entities'
import { FeedbackReport as FeedbackReportEntity } from '@stardust/core/reporting/entities'
import type { FeedbackReportsPageDto } from '@stardust/core/reporting/entities/dtos'
import type { FeedbackReportsRepository } from '@stardust/core/reporting/interfaces'
import type { FeedbackReportStatus } from '@stardust/core/reporting/structures'
import type { FeedbackReportsListingParams } from '@stardust/core/reporting/types'

import { type PostgresClient, postgresClient } from './PostgresClient'

type FeedbackReportRow = {
  id: string
  content: string
  screenshot: string | null
  intent: 'bug' | 'idea' | 'other'
  user_id: string
  title: string
  status: 'open' | 'closed'
  created_at: Date | string
  last_activity_at: Date | string
  last_user_message_at: Date | string | null
  studio_read_at: Date | string | null
  last_admin_message_at: Date | string | null
  author_read_at: Date | string | null
  admin_message_count: number | string
  author_name: string
  author_email: string
  author_slug: string
  avatar_name: string | null
  avatar_image: string | null
  preview: string
  is_unread: boolean
  total_count?: number | string
  summary_total?: number | string
  summary_open?: number | string
  summary_closed?: number | string
  summary_unread?: number | string
}

const timestamp = (value: Date | string | null): string | undefined => {
  if (!value) return undefined
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

const authorFromRow = (row: FeedbackReportRow) => {
  const authorName = row.author_name?.trim().length >= 2 ? row.author_name : 'Você'
  const authorSlug = row.author_slug?.trim().length >= 2 ? row.author_slug : 'voce'
  const avatarName =
    row.avatar_name && row.avatar_name.trim().length >= 2 ? row.avatar_name : authorName
  const avatarImage =
    row.avatar_image && /\.(png|jpe?g|gif|svg)$/i.test(row.avatar_image)
      ? row.avatar_image
      : '/images/profile.svg'

  return {
    id: row.user_id,
    entity: {
      name: authorName,
      slug: authorSlug,
      avatar: { name: avatarName, image: avatarImage },
    },
  }
}

const toEntity = (row: FeedbackReportRow): FeedbackReport => {
  return FeedbackReportEntity.create({
    id: row.id,
    content: row.content,
    intent: row.intent,
    screenshot: row.screenshot ?? undefined,
    sentAt: timestamp(row.created_at),
    author: authorFromRow(row),
    title: row.title,
    status: row.status,
    createdAt: timestamp(row.created_at),
    lastActivityAt: timestamp(row.last_activity_at),
    lastUserMessageAt: timestamp(row.last_user_message_at),
    studioReadAt: timestamp(row.studio_read_at),
    lastAdminMessageAt: timestamp(row.last_admin_message_at),
    authorReadAt: timestamp(row.author_read_at),
    adminMessageCount: Number(row.admin_message_count ?? 0),
    authorEmail: row.author_email,
    preview: row.preview ?? row.content,
    isUnread: row.is_unread,
  })
}

const rowToUpdate = (report: FeedbackReport) => ({
  id: report.id.value,
  content: report.content.value,
  screenshot: report.screenshot?.value ?? null,
  intent: report.intent.value,
  userId: report.author.id.value,
  title: report.title.value,
  status: report.status.value,
  createdAt: report.createdAt.toISOString(),
  lastActivityAt: report.lastActivityAt.toISOString(),
  lastUserMessageAt: report.lastUserMessageAt?.toISOString() ?? null,
  studioReadAt: report.studioReadAt?.toISOString() ?? null,
  lastAdminMessageAt: report.lastAdminMessageAt?.toISOString() ?? null,
  authorReadAt: report.authorReadAt?.toISOString() ?? null,
})

type FeedbackReportListQuery = {
  search: string | null
  intent: string | null
  status: string | null
  startAt: string | null
  endAt: string | null
  page: number
  itemsPerPage: number
}

const normalizeFeedbackReportListQuery = (
  params: FeedbackReportsListingParams,
): FeedbackReportListQuery => {
  const period = params.createdAtPeriod ?? params.sentAtPeriod
  return {
    search: params.search?.value ?? params.authorName?.value ?? null,
    intent: params.intent?.value ?? null,
    status: params.status?.value ?? null,
    startAt: period?.startDate.toISOString() ?? null,
    endAt: period?.endDate.toISOString() ?? null,
    page: params.page?.value ?? 1,
    itemsPerPage: params.itemsPerPage?.value ?? 20,
  }
}

export class PostgresFeedbackReportsRepository implements FeedbackReportsRepository {
  constructor(private readonly client: PostgresClient = postgresClient) {}

  async add(report: FeedbackReport): Promise<void> {
    const value = rowToUpdate(report)
    await this.client.query`
      insert into public.feedback_reports (
        id, content, screenshot, intent, user_id, title, status, created_at,
        last_activity_at, last_user_message_at, studio_read_at,
        last_admin_message_at, author_read_at
      ) values (
        ${value.id}, ${value.content}, ${value.screenshot}, ${value.intent},
        ${value.userId}, ${value.title}, ${value.status}, ${value.createdAt},
        ${value.lastActivityAt}, ${value.lastUserMessageAt}, ${value.studioReadAt},
        ${value.lastAdminMessageAt}, ${value.authorReadAt}
      )
    `
  }

  async findById(feedbackReportId: Id): Promise<FeedbackReport | null> {
    const rows = await this.client.query<FeedbackReportRow>`
      select
        r.id, r.content, r.screenshot, r.intent, r.user_id, r.title, r.status,
        r.created_at, r.last_activity_at, r.last_user_message_at, r.studio_read_at,
        r.last_admin_message_at, r.author_read_at,
        count(m.id) filter (where m.author_role = 'admin')::integer as admin_message_count,
        u.name as author_name, u.email as author_email, u.slug as author_slug,
        a.name as avatar_name, a.image as avatar_image,
        coalesce((
          select left(latest.content, 160)
          from public.feedback_messages latest
          where latest.report_id = r.id
          order by latest.created_at desc, latest.id desc
          limit 1
        ), left(r.content, 160)) as preview,
        (r.last_user_message_at is not null and
          (r.studio_read_at is null or r.last_user_message_at > r.studio_read_at)) as is_unread
      from public.feedback_reports r
      join public.users u on u.id = r.user_id
      left join public.avatars a on a.id = u.avatar_id
      left join public.feedback_messages m on m.report_id = r.id
      where r.id = ${feedbackReportId.value}
      group by r.id, u.name, u.email, u.slug, a.name, a.image
      limit 1
    `
    return rows[0] ? toEntity(rows[0]) : null
  }

  async findByIdAndAuthor(
    feedbackReportId: Id,
    authorId: Id,
  ): Promise<FeedbackReport | null> {
    const report = await this.findById(feedbackReportId)
    return report?.author.id.value === authorId.value ? report : null
  }

  async findAuthorEmail(feedbackReportId: Id): Promise<Email | null> {
    const rows = await this.client.query<{ email: string }>`
      select u.email
      from public.feedback_reports r
      join public.users u on u.id = r.user_id
      where r.id = ${feedbackReportId.value}
      limit 1
    `
    return rows[0]?.email ? EmailValue.create(rows[0].email) : null
  }

  async list(params: FeedbackReportsListingParams): Promise<FeedbackReportsPageDto> {
    const query = normalizeFeedbackReportListQuery(params)
    const [rows, summaryRows] = await Promise.all([
      this.queryListRows(query),
      this.queryListSummary(query),
    ])
    const summary = summaryRows[0]

    return {
      items: rows.filter((row) => row.id !== null).map((row) => toEntity(row).dto),
      page: query.page,
      itemsPerPage: query.itemsPerPage,
      total: Number(rows[0]?.total_count ?? summary?.filtered_total ?? 0),
      summary: {
        total: Number(summary?.summary_total ?? 0),
        open: Number(summary?.summary_open ?? 0),
        closed: Number(summary?.summary_closed ?? 0),
        unread: Number(summary?.summary_unread ?? 0),
      },
    }
  }

  private queryListRows(query: FeedbackReportListQuery) {
    return this.client.query<FeedbackReportRow>`
      with filtered as (
        select
          r.id, r.content, r.screenshot, r.intent, r.user_id, r.title, r.status,
          r.created_at, r.last_activity_at, r.last_user_message_at, r.studio_read_at,
          r.last_admin_message_at, r.author_read_at,
          count(m.id) filter (where m.author_role = 'admin')::integer as admin_message_count,
          u.name as author_name, u.email as author_email, u.slug as author_slug,
          a.name as avatar_name, a.image as avatar_image,
          coalesce((
            select left(latest.content, 160)
            from public.feedback_messages latest
            where latest.report_id = r.id
            order by latest.created_at desc, latest.id desc
            limit 1
          ), left(r.content, 160)) as preview,
          (r.last_user_message_at is not null and
            (r.studio_read_at is null or r.last_user_message_at > r.studio_read_at)) as is_unread
        from public.feedback_reports r
        join public.users u on u.id = r.user_id
        left join public.avatars a on a.id = u.avatar_id
        left join public.feedback_messages m on m.report_id = r.id
        where (
          ${query.search}::text is null or r.id::text ilike '%' || ${query.search}::text || '%'
          or exists (
            select 1 from public.users search_user
            where search_user.id = r.user_id
              and search_user.email ilike '%' || ${query.search}::text || '%'
          )
        )
          and (${query.intent}::public.feedback_intent is null or r.intent = ${query.intent}::public.feedback_intent)
          and (${query.status}::text is null or r.status = ${query.status}::text)
          and (${query.startAt}::timestamptz is null or r.created_at >= ${query.startAt}::timestamptz)
          and (${query.endAt}::timestamptz is null or r.created_at <= ${query.endAt}::timestamptz)
        group by r.id, u.name, u.email, u.slug, a.name, a.image
      ), paged as (
        select *, count(*) over() as total_count
        from filtered
        order by is_unread desc, last_activity_at desc, id desc
        offset greatest(${query.page} - 1, 0) * ${query.itemsPerPage}
        limit greatest(${query.itemsPerPage}, 1)
      )
      select * from paged
    `
  }

  private queryListSummary(query: FeedbackReportListQuery) {
    return this.client.query<{
      summary_total: number
      summary_open: number
      summary_closed: number
      summary_unread: number
      filtered_total: number
    }>`
      select
        (select count(*)::integer from public.feedback_reports) as summary_total,
        (select count(*)::integer from public.feedback_reports where status = 'open') as summary_open,
        (select count(*)::integer from public.feedback_reports where status = 'closed') as summary_closed,
        (select count(*)::integer from public.feedback_reports where last_user_message_at is not null
          and (studio_read_at is null or last_user_message_at > studio_read_at)) as summary_unread,
        (select count(*)::integer from public.feedback_reports r
          where (${query.search}::text is null or r.id::text ilike '%' || ${query.search}::text || '%'
            or exists (select 1 from public.users search_user
              where search_user.id = r.user_id
                and search_user.email ilike '%' || ${query.search}::text || '%'))
            and (${query.intent}::public.feedback_intent is null or r.intent = ${query.intent}::public.feedback_intent)
            and (${query.status}::text is null or r.status = ${query.status}::text)
            and (${query.startAt}::timestamptz is null or r.created_at >= ${query.startAt}::timestamptz)
            and (${query.endAt}::timestamptz is null or r.created_at <= ${query.endAt}::timestamptz)) as filtered_total
    `
  }

  async findMany(
    params: FeedbackReportsListingParams,
  ): Promise<ManyItems<FeedbackReport>> {
    const period = params.sentAtPeriod
    const authorName = params.authorName?.value ?? null
    const intent = params.intent?.value ?? null
    const startAt = period?.startDate.toISOString() ?? null
    const endAt = period?.endDate.toISOString() ?? null
    const page = params.page?.value ?? 1
    const itemsPerPage = params.itemsPerPage?.value ?? 20
    const rows = await this.client.query<FeedbackReportRow>`
      select r.id, r.content, r.screenshot, r.intent, r.user_id, r.title, r.status,
        r.created_at, r.last_activity_at, r.last_user_message_at, r.studio_read_at,
        r.last_admin_message_at, r.author_read_at,
        (select count(*)::integer from public.feedback_messages m
          where m.report_id = r.id and m.author_role = 'admin') as admin_message_count,
        u.name as author_name, u.email as author_email, u.slug as author_slug,
        a.name as avatar_name, a.image as avatar_image, r.content as preview,
        (r.last_user_message_at is not null and
          (r.studio_read_at is null or r.last_user_message_at > r.studio_read_at)) as is_unread,
        count(*) over()::integer as total_count
      from public.feedback_reports r
      join public.users u on u.id = r.user_id
      left join public.avatars a on a.id = u.avatar_id
      where (${authorName}::text is null or u.name ilike '%' || ${authorName}::text || '%')
        and (${intent}::public.feedback_intent is null or r.intent = ${intent}::public.feedback_intent)
        and (${startAt}::timestamptz is null or r.created_at >= ${startAt}::timestamptz)
        and (${endAt}::timestamptz is null or r.created_at <= ${endAt}::timestamptz)
      order by r.created_at desc
      offset greatest(${page} - 1, 0) * ${itemsPerPage}
      limit greatest(${itemsPerPage}, 1)
    `
    const totals = await this.client.query<{ total: number }>`
      select count(*)::integer as total
      from public.feedback_reports r
      join public.users u on u.id = r.user_id
      where (${authorName}::text is null or u.name ilike '%' || ${authorName}::text || '%')
        and (${intent}::public.feedback_intent is null or r.intent = ${intent}::public.feedback_intent)
        and (${startAt}::timestamptz is null or r.created_at >= ${startAt}::timestamptz)
        and (${endAt}::timestamptz is null or r.created_at <= ${endAt}::timestamptz)
    `
    return { items: rows.map(toEntity), count: Number(totals[0]?.total ?? 0) }
  }

  async save(report: FeedbackReport): Promise<void> {
    const value = rowToUpdate(report)
    await this.client.query`
      update public.feedback_reports
      set content = ${value.content}, screenshot = ${value.screenshot}, intent = ${value.intent},
        user_id = ${value.userId}, title = ${value.title}, status = ${value.status},
        created_at = ${value.createdAt}, last_activity_at = ${value.lastActivityAt},
        last_user_message_at = ${value.lastUserMessageAt}, studio_read_at = ${value.studioReadAt},
        last_admin_message_at = ${value.lastAdminMessageAt}, author_read_at = ${value.authorReadAt}
      where id = ${value.id}
    `
  }

  async changeStatus(
    report: FeedbackReport,
    expectedStatus: FeedbackReportStatus,
  ): Promise<FeedbackReport> {
    const rows = await this.client.query<FeedbackReportRow>`
      update public.feedback_reports r
      set status = ${report.status.value}, last_activity_at = greatest(r.last_activity_at, now())
      from public.users u
      left join public.avatars a on a.id = u.avatar_id
      where r.id = ${report.id.value} and r.status = ${expectedStatus.value}
        and u.id = r.user_id
      returning r.id, r.content, r.screenshot, r.intent, r.user_id, r.title, r.status,
        r.created_at, r.last_activity_at, r.last_user_message_at, r.studio_read_at,
        r.last_admin_message_at, r.author_read_at,
        (select count(*)::integer from public.feedback_messages m
          where m.report_id = r.id and m.author_role = 'admin') as admin_message_count,
        u.name as author_name, u.email as author_email, u.slug as author_slug,
        a.name as avatar_name, a.image as avatar_image, r.content as preview,
        (r.last_user_message_at is not null and
          (r.studio_read_at is null or r.last_user_message_at > r.studio_read_at)) as is_unread
    `
    if (rows[0]) return toEntity(rows[0])

    const current = await this.findById(report.id)
    if (!current) throw new NotFoundError('Relatório de feedback não encontrado')
    throw new ConflictError(`Estado canônico: ${current.status.value}`)
  }

  async listByAuthor(input: {
    authorId: Id
    status?: FeedbackReportStatus
    page: OrdinalNumber
    itemsPerPage: OrdinalNumber
  }): Promise<{ items: FeedbackReport[]; total: number }> {
    const rows = await this.client.query<FeedbackReportRow>`
      select r.id, r.content, r.screenshot, r.intent, r.user_id, r.title, r.status,
        r.created_at, r.last_activity_at, r.last_user_message_at, r.studio_read_at,
        r.last_admin_message_at, r.author_read_at, 0::integer as admin_message_count,
        u.name as author_name, u.email as author_email, u.slug as author_slug,
        a.name as avatar_name, a.image as avatar_image, r.content as preview,
        false as is_unread, count(*) over()::integer as total_count
      from public.feedback_reports r
      join public.users u on u.id = r.user_id
      left join public.avatars a on a.id = u.avatar_id
      where r.user_id = ${input.authorId.value}
        and (${input.status?.value ?? null}::text is null or r.status = ${input.status?.value ?? null}::text)
      order by r.created_at desc, r.id desc
      offset greatest(${input.page.value} - 1, 0) * ${input.itemsPerPage.value}
      limit greatest(${input.itemsPerPage.value}, 1)
    `
    return { items: rows.map(toEntity), total: Number(rows[0]?.total_count ?? 0) }
  }

  async countUnreadByAuthor(authorId: Id): Promise<number> {
    const rows = await this.client.query<{ count: number }>`
      select count(*)::integer as count from public.feedback_reports
      where user_id = ${authorId.value} and last_admin_message_at is not null
        and (author_read_at is null or last_admin_message_at > author_read_at)
    `
    return Number(rows[0]?.count ?? 0)
  }

  async markAsRead(input: {
    feedbackReportId: Id
    participant: 'author' | 'studio'
    lastSeenMessageAt: Date
    authorId?: Id
  }): Promise<void>
  async markAsRead(input: Id, lastSeenMessageAt?: Date): Promise<void>
  async markAsRead(
    inputOrReportId:
      | Id
      | {
          feedbackReportId: Id
          participant: 'author' | 'studio'
          lastSeenMessageAt: Date
          authorId?: Id
        },
    legacyLastSeenMessageAt?: Date,
  ): Promise<void> {
    if (inputOrReportId instanceof Object && 'participant' in inputOrReportId) {
      const input = inputOrReportId
      if (input.participant === 'author') {
        if (!input.authorId) throw new Error('A leitura do autor exige o actorId')
        await this.client.query`
        update public.feedback_reports
        set author_read_at = greatest(coalesce(author_read_at, '-infinity'::timestamptz), ${input.lastSeenMessageAt.toISOString()})
        where id = ${input.feedbackReportId.value} and user_id = ${input.authorId.value}
          and last_admin_message_at is not null
          and ${input.lastSeenMessageAt.toISOString()} <= last_admin_message_at
      `
        return
      }

      await this.client.query`
        update public.feedback_reports
        set studio_read_at = ${input.lastSeenMessageAt.toISOString()}
        where id = ${input.feedbackReportId.value}
          and (studio_read_at is null or studio_read_at < ${input.lastSeenMessageAt.toISOString()})
      `
      return
    }

    await this.client.query`
      update public.feedback_reports
      set studio_read_at = ${legacyLastSeenMessageAt?.toISOString() ?? null}
      where id = ${inputOrReportId.value}
    `
  }
}
