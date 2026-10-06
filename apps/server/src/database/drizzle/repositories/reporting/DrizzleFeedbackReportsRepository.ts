import type { DrizzleTransaction } from '../../DrizzleClient'
import {
  and,
  desc,
  eq,
  getTableColumns,
  gte,
  ilike,
  isNotNull,
  lte,
  or,
  sql,
  type SQL,
} from 'drizzle-orm'
import { FeedbackReport } from '@stardust/core/reporting/entities'
import type { FeedbackReportsRepository } from '@stardust/core/reporting/interfaces'
import type { FeedbackReportsListingParams } from '@stardust/core/reporting/types'
import type { FeedbackReportsPageDto } from '@stardust/core/reporting/entities/dtos'
import type { FeedbackReportStatus } from '@stardust/core/reporting/structures'
import { Email, type Id, type OrdinalNumber } from '@stardust/core/global/structures'
import { AuthError, ConflictError, NotFoundError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { feedbackReportModel } from '../../models/reporting/feedback-report-model'
import { feedbackMessageModel } from '../../models/reporting/feedback-message-model'
import { userModel } from '../../models/profile/user-model'
import { avatarModel } from '../../models/shop/avatar-model'
import { DrizzleFeedbackReportMapper } from '../../mappers/reporting/DrizzleFeedbackReportMapper'

export class DrizzleFeedbackReportsRepository
  extends DrizzleRepository
  implements FeedbackReportsRepository
{
  private admin(): void {
    if (this.access.kind !== 'god' && this.access.kind !== 'system')
      throw new AuthError('Conta não autorizada')
  }

  private ownerCondition(): SQL | undefined {
    if (this.access.kind === 'public') throw new AuthError('Conta não autorizada')
    return this.access.kind === 'user'
      ? eq(feedbackReportModel.userId, this.access.accountId.value)
      : undefined
  }

  private authorizeOwner(authorId: Id): void {
    this.ownerCondition()
    if (this.access.kind === 'user' && this.access.accountId.value !== authorId.value)
      throw new AuthError('Conta não autorizada')
  }

  private unread(author = this.access.kind === 'user') {
    const messageAt = author
      ? feedbackReportModel.lastAdminMessageAt
      : feedbackReportModel.lastUserMessageAt
    const readAt = author
      ? feedbackReportModel.authorReadAt
      : feedbackReportModel.studioReadAt
    return sql<boolean>`(${messageAt} is not null and (${readAt} is null or ${messageAt} > ${readAt}))`
  }

  private conversationColumns(author: boolean) {
    return {
      adminMessageCount: sql<number>`(select count(*)::integer from ${feedbackMessageModel} where ${feedbackMessageModel.reportId} = ${feedbackReportModel.id} and ${feedbackMessageModel.authorRole} = 'admin')`,
      preview: sql<string>`coalesce((select left(${feedbackMessageModel.content}, 160) from ${feedbackMessageModel} where ${feedbackMessageModel.reportId} = ${feedbackReportModel.id} order by ${feedbackMessageModel.createdAt} desc, ${feedbackMessageModel.id} desc limit 1), left(${feedbackReportModel.content}, 160))`,
      isUnread: this.unread(author),
    }
  }

  private query(author = this.access.kind === 'user') {
    return this.database
      .select(this.readColumns(author))
      .from(feedbackReportModel)
      .innerJoin(userModel, eq(userModel.id, feedbackReportModel.userId))
      .leftJoin(avatarModel, eq(avatarModel.id, userModel.avatarId))
  }

  private authorColumns() {
    return {
      authorName: userModel.name,
      authorEmail: userModel.email,
      authorSlug: userModel.slug,
      authorAvatarName: avatarModel.name,
      authorAvatarImage: avatarModel.image,
    }
  }

  private readColumns(author: boolean) {
    return {
      ...getTableColumns(feedbackReportModel),
      ...this.authorColumns(),
      ...this.conversationColumns(author),
    }
  }

  private toEntity(
    row: Awaited<ReturnType<DrizzleFeedbackReportsRepository['query']>>[number],
  ): FeedbackReport {
    return DrizzleFeedbackReportMapper.toEntity({
      ...row,
      users: this.authorProfile(row),
    })
  }

  private authorProfile(
    row: Awaited<ReturnType<DrizzleFeedbackReportsRepository['query']>>[number],
  ) {
    return {
      name: row.authorName,
      email: row.authorEmail,
      slug: row.authorSlug,
      avatar: this.authorAvatar(row),
    }
  }

  private authorAvatar(
    row: Awaited<ReturnType<DrizzleFeedbackReportsRepository['query']>>[number],
  ) {
    return row.authorAvatarName !== null && row.authorAvatarImage !== null
      ? { name: row.authorAvatarName, image: row.authorAvatarImage }
      : null
  }

  async findById(feedbackReportId: Id): Promise<FeedbackReport | null> {
    const owner = this.ownerCondition()
    return this.findOneResult(
      async () =>
        this.query()
          .where(and(eq(feedbackReportModel.id, feedbackReportId.value), owner))
          .limit(1),
      (row) => this.toEntity(row),
    )
  }

  async findByIdAndAuthor(
    feedbackReportId: Id,
    authorId: Id,
  ): Promise<FeedbackReport | null> {
    this.authorizeOwner(authorId)
    return this.findOneResult(
      async () =>
        this.query(true)
          .where(this.authorReportFilter(feedbackReportId, authorId))
          .limit(1),
      (row) => this.toEntity(row),
    )
  }

  private authorReportFilter(feedbackReportId: Id, authorId: Id) {
    return and(
      eq(feedbackReportModel.id, feedbackReportId.value),
      eq(feedbackReportModel.userId, authorId.value),
    )
  }

  async findAuthorEmail(feedbackReportId: Id): Promise<Email | null> {
    this.admin()
    return this.findOneResult(
      async () =>
        this.database
          .select({ email: userModel.email })
          .from(feedbackReportModel)
          .innerJoin(userModel, eq(userModel.id, feedbackReportModel.userId))
          .where(eq(feedbackReportModel.id, feedbackReportId.value))
          .limit(1),
      (row) => Email.create(row.email),
    )
  }

  async add(report: FeedbackReport): Promise<void> {
    this.authorizeOwner(report.author.id)
    await this.executeQuery(async () => {
      await this.database
        .insert(feedbackReportModel)
        .values(DrizzleFeedbackReportMapper.toPersistence(report))
    })
  }

  private async lockReport(transaction: DrizzleTransaction, filter: SQL | undefined) {
    const [current] = await this.lockedReportQuery(transaction, filter)
    if (!current) throw new NotFoundError('Relatório de feedback não encontrado')
    return current
  }

  private lockedReportQuery(transaction: DrizzleTransaction, filter: SQL | undefined) {
    return transaction
      .select()
      .from(feedbackReportModel)
      .where(filter)
      .for('update')
      .limit(1)
  }

  async save(report: FeedbackReport): Promise<void> {
    this.authorizeOwner(report.author.id)
    const owner = this.ownerCondition()
    await this.executeQuery(async () =>
      this.database.transaction((transaction) =>
        this.saveReport(transaction, report, owner),
      ),
    )
  }

  private async saveReport(
    transaction: DrizzleTransaction,
    report: FeedbackReport,
    owner: SQL | undefined,
  ): Promise<void> {
    const current = await this.lockReport(
      transaction,
      and(eq(feedbackReportModel.id, report.id.value), owner),
    )
    await this.updateSavedReport(transaction, report, current)
  }

  private updateSavedReport(
    transaction: DrizzleTransaction,
    report: FeedbackReport,
    current: typeof feedbackReportModel.$inferSelect,
  ) {
    return transaction
      .update(feedbackReportModel)
      .set(this.savedValues(report, current))
      .where(eq(feedbackReportModel.id, report.id.value))
  }

  private savedValues(
    report: FeedbackReport,
    current: typeof feedbackReportModel.$inferSelect,
  ) {
    const admin = this.access.kind === 'god' || this.access.kind === 'system'
    return {
      ...this.savedContent(report),
      ...this.savedConversationValues(report, current, admin),
    }
  }

  private savedConversationValues(
    report: FeedbackReport,
    current: typeof feedbackReportModel.$inferSelect,
    admin: boolean,
  ) {
    return {
      status: admin && report.status.isClosed.isTrue ? 'closed' : current.status,
      ...this.savedAuthorActivity(report),
      ...this.savedAdminActivity(report, current, admin),
    }
  }

  private savedContent(report: FeedbackReport) {
    return {
      content: report.content.value,
      screenshot: report.screenshot?.value ?? null,
      intent: report.intent.value,
      title: report.title.value,
    }
  }

  private savedAuthorActivity(report: FeedbackReport) {
    const { lastActivityAt, lastUserMessageAt, authorReadAt } = feedbackReportModel
    return {
      lastActivityAt: sql`greatest(${lastActivityAt}, ${report.lastActivityAt.toISOString()})`,
      lastUserMessageAt: sql`greatest(${lastUserMessageAt}, ${report.lastUserMessageAt?.toISOString() ?? null})`,
      authorReadAt: sql`greatest(${authorReadAt}, ${report.authorReadAt?.toISOString() ?? null})`,
    }
  }

  private savedAdminActivity(
    report: FeedbackReport,
    current: typeof feedbackReportModel.$inferSelect,
    admin: boolean,
  ) {
    if (!admin)
      return {
        lastAdminMessageAt: current.lastAdminMessageAt,
        studioReadAt: current.studioReadAt,
      }
    return this.advancedAdminActivity(report)
  }

  private advancedAdminActivity(report: FeedbackReport) {
    const { lastAdminMessageAt, studioReadAt } = feedbackReportModel
    return {
      lastAdminMessageAt: sql`greatest(${lastAdminMessageAt}, ${report.lastAdminMessageAt?.toISOString() ?? null})`,
      studioReadAt: sql`greatest(${studioReadAt}, ${report.studioReadAt?.toISOString() ?? null})`,
    }
  }

  async changeStatus(
    report: FeedbackReport,
    expectedStatus: FeedbackReportStatus,
  ): Promise<FeedbackReport> {
    this.admin()
    return this.executeQuery(async () =>
      this.database.transaction((transaction) =>
        this.transitionReport(transaction, report, expectedStatus),
      ),
    )
  }

  private lockReportById(transaction: DrizzleTransaction, report: FeedbackReport) {
    return this.lockReport(transaction, eq(feedbackReportModel.id, report.id.value))
  }

  private async transitionReport(
    transaction: DrizzleTransaction,
    report: FeedbackReport,
    expectedStatus: FeedbackReportStatus,
  ): Promise<FeedbackReport> {
    const current = await this.lockReportById(transaction, report)
    if (current.status !== expectedStatus.value)
      throw new ConflictError(`Estado canônico: ${current.status}`)
    const [updated] = await this.updateStatusQuery(transaction, report, expectedStatus)
    return this.changedReport(report, current, updated)
  }

  private updateStatusQuery(
    transaction: DrizzleTransaction,
    report: FeedbackReport,
    expectedStatus: FeedbackReportStatus,
  ) {
    return transaction
      .update(feedbackReportModel)
      .set(this.statusTransitionValues(report))
      .where(this.expectedStatusFilter(report, expectedStatus))
      .returning()
  }

  private statusTransitionValues(report: FeedbackReport) {
    return {
      status: report.status.value,
      lastActivityAt: sql`greatest(${feedbackReportModel.lastActivityAt}, now())`,
    }
  }

  private expectedStatusFilter(
    report: FeedbackReport,
    expectedStatus: FeedbackReportStatus,
  ) {
    return and(
      eq(feedbackReportModel.id, report.id.value),
      eq(feedbackReportModel.status, expectedStatus.value),
    )
  }

  private changedReport(
    report: FeedbackReport,
    current: typeof feedbackReportModel.$inferSelect,
    updated: typeof feedbackReportModel.$inferSelect | undefined,
  ): FeedbackReport {
    if (!updated) throw new ConflictError(`Estado canônico: ${current.status}`)
    return FeedbackReport.create({
      ...report.dto,
      status: report.status.value,
      lastActivityAt: updated.lastActivityAt.toISOString(),
    })
  }

  private listingFilter(
    params: FeedbackReportsListingParams,
    legacy = false,
  ): SQL | undefined {
    return and(
      this.searchFilter(params, legacy),
      this.classificationFilter(params, legacy),
      this.periodFilter(params, legacy),
    )
  }

  private searchFilter(params: FeedbackReportsListingParams, legacy: boolean) {
    const search = params.search?.value ?? params.authorName?.value
    if (legacy) return this.legacyAuthorSearch(params)
    return this.reportIdentitySearch(search)
  }

  private legacyAuthorSearch(params: FeedbackReportsListingParams) {
    return params.authorName
      ? ilike(userModel.name, `%${params.authorName.value}%`)
      : undefined
  }

  private reportIdentitySearch(search: string | undefined) {
    if (!search) return undefined
    return or(
      sql`${feedbackReportModel.id}::text ilike ${`%${search}%`}`,
      ilike(userModel.email, `%${search}%`),
    )
  }

  private classificationFilter(
    { intent, status }: FeedbackReportsListingParams,
    legacy: boolean,
  ) {
    return and(
      intent ? eq(feedbackReportModel.intent, intent.value) : undefined,
      !legacy && status ? eq(feedbackReportModel.status, status.value) : undefined,
    )
  }

  private periodFilter(params: FeedbackReportsListingParams, legacy: boolean) {
    const period = legacy
      ? params.sentAtPeriod
      : (params.createdAtPeriod ?? params.sentAtPeriod)
    if (!period) return undefined
    return this.createdWithinPeriod(period)
  }

  private createdWithinPeriod(
    period: NonNullable<FeedbackReportsListingParams['sentAtPeriod']>,
  ) {
    return and(
      gte(feedbackReportModel.createdAt, period.startDate),
      lte(feedbackReportModel.createdAt, period.endDate),
    )
  }

  private countQuery(filter: SQL | undefined) {
    return this.database
      .select({ count: sql<number>`count(*)::integer` })
      .from(feedbackReportModel)
      .innerJoin(userModel, eq(userModel.id, feedbackReportModel.userId))
      .where(filter)
  }

  private legacyPageQuery(filter: SQL | undefined, params: FeedbackReportsListingParams) {
    const query = this.query().where(filter).orderBy(desc(feedbackReportModel.createdAt))
    const range = this.optionalPageRange(params)
    return range ? query.offset(range.offset).limit(range.limit) : query
  }

  private optionalPageRange(params: FeedbackReportsListingParams) {
    return params.page && params.itemsPerPage
      ? this.calculateQueryRange(params.page.value, params.itemsPerPage.value)
      : undefined
  }

  async findMany(
    params: FeedbackReportsListingParams,
  ): Promise<{ items: FeedbackReport[]; count: number }> {
    this.admin()
    return this.executeQuery(() => this.legacyList(params))
  }

  private legacyListQueries(
    filter: SQL | undefined,
    params: FeedbackReportsListingParams,
  ) {
    return Promise.all([this.legacyPageQuery(filter, params), this.countQuery(filter)])
  }

  private async legacyList(params: FeedbackReportsListingParams) {
    const filter = this.listingFilter(params, true)
    const [rows, [total]] = await this.legacyListQueries(filter, params)
    return { items: this.entities(rows), count: total?.count ?? 0 }
  }

  private entities(rows: Awaited<ReturnType<DrizzleFeedbackReportsRepository['query']>>) {
    return rows.map((row) => this.toEntity(row))
  }

  private summaryQuery() {
    return this.database.select(this.summaryColumns()).from(feedbackReportModel)
  }

  private summaryColumns() {
    const { status } = feedbackReportModel
    return {
      total: sql<number>`count(*)::integer`,
      open: sql<number>`count(*) filter (where ${status} = 'open')::integer`,
      closed: sql<number>`count(*) filter (where ${status} = 'closed')::integer`,
      unread: sql<number>`count(*) filter (where ${this.unread(false)})::integer`,
    }
  }

  private activityPageQuery(
    filter: SQL | undefined,
    page: number,
    itemsPerPage: number,
    author: boolean,
  ) {
    const range = this.calculateQueryRange(page, itemsPerPage)
    return this.orderedActivityQuery(filter, author)
      .offset(range.offset)
      .limit(range.limit)
  }

  private orderedActivityQuery(filter: SQL | undefined, author: boolean) {
    const { lastActivityAt, id } = feedbackReportModel
    return this.query(author)
      .where(filter)
      .orderBy(desc(this.unread(author)), desc(lastActivityAt), desc(id))
  }

  private authorCountQuery(filter: SQL | undefined) {
    return this.database
      .select({ count: sql<number>`count(*)::integer` })
      .from(feedbackReportModel)
      .where(filter)
  }

  async list(params: FeedbackReportsListingParams): Promise<FeedbackReportsPageDto> {
    this.admin()
    return this.executeQuery(() => this.adminPage(params))
  }

  private async adminPage(
    params: FeedbackReportsListingParams,
  ): Promise<FeedbackReportsPageDto> {
    const page = params.page?.value ?? 1,
      itemsPerPage = params.itemsPerPage?.value ?? 20
    const results = await this.adminPageQueries(params, page, itemsPerPage)
    return this.adminPageResult(results, page, itemsPerPage)
  }

  private adminPageQueries(
    params: FeedbackReportsListingParams,
    page: number,
    itemsPerPage: number,
  ) {
    const filter = this.listingFilter(params)
    return Promise.all([
      this.activityPageQuery(filter, page, itemsPerPage, false),
      this.countQuery(filter),
      this.summaryQuery(),
    ])
  }

  private adminPageResult(
    results: Awaited<ReturnType<DrizzleFeedbackReportsRepository['adminPageQueries']>>,
    page: number,
    itemsPerPage: number,
  ): FeedbackReportsPageDto {
    const [rows] = results
    return {
      items: this.entities(rows).map((report) => report.dto),
      ...this.adminPageMetadata(results, page, itemsPerPage),
    }
  }

  private adminPageMetadata(
    results: Awaited<ReturnType<DrizzleFeedbackReportsRepository['adminPageQueries']>>,
    page: number,
    itemsPerPage: number,
  ) {
    const [, [total], [summary]] = results
    return {
      page,
      itemsPerPage,
      total: total?.count ?? 0,
      summary: summary ?? { total: 0, open: 0, closed: 0, unread: 0 },
    }
  }

  async listByAuthor({
    authorId,
    status,
    page,
    itemsPerPage,
  }: {
    authorId: Id
    status?: FeedbackReportStatus
    page: OrdinalNumber
    itemsPerPage: OrdinalNumber
  }): Promise<{ items: FeedbackReport[]; total: number }> {
    this.authorizeOwner(authorId)
    return this.executeQuery(() => {
      const filter = this.authorListingFilter(authorId, status)
      return this.authorPage(filter, page.value, Math.min(itemsPerPage.value, 10))
    })
  }

  private authorListingFilter(authorId: Id, status: FeedbackReportStatus | undefined) {
    return and(
      eq(feedbackReportModel.userId, authorId.value),
      status ? eq(feedbackReportModel.status, status.value) : undefined,
    )
  }

  private authorPageResult(
    rows: Awaited<ReturnType<DrizzleFeedbackReportsRepository['activityPageQuery']>>,
    total:
      | Awaited<ReturnType<DrizzleFeedbackReportsRepository['authorCountQuery']>>[number]
      | undefined,
  ) {
    return {
      items: this.entities(rows),
      total: total?.count ?? 0,
    }
  }

  private async authorPage(
    filter: SQL | undefined,
    pageNumber: number,
    pageLimit: number,
  ) {
    const [rows, [total]] = await Promise.all([
      this.activityPageQuery(filter, pageNumber, pageLimit, true),
      this.authorCountQuery(filter),
    ])
    return this.authorPageResult(rows, total)
  }

  async countUnreadByAuthor(authorId: Id): Promise<number> {
    this.authorizeOwner(authorId)
    return this.executeQuery(async () => {
      const [row] = await this.database
        .select({ count: sql<number>`count(*)::integer` })
        .from(feedbackReportModel)
        .where(and(eq(feedbackReportModel.userId, authorId.value), this.unread(true)))
      return row?.count ?? 0
    })
  }

  async markAsRead(
    input:
      | Id
      | {
          feedbackReportId: Id
          participant: 'author' | 'studio'
          lastSeenMessageAt: Date
          authorId?: Id
        },
    legacyLastSeenMessageAt?: Date | null,
  ): Promise<void> {
    if (!('participant' in input)) {
      this.admin()
      await this.executeQuery(async () =>
        this.database
          .update(feedbackReportModel)
          .set({ studioReadAt: legacyLastSeenMessageAt ?? null })
          .where(eq(feedbackReportModel.id, input.value)),
      )
      return
    }
    const { feedbackReportId, participant, lastSeenMessageAt, authorId } = input
    if (participant === 'author') {
      await this.markAuthorAsRead(feedbackReportId, lastSeenMessageAt, authorId)
    } else {
      this.admin()
      await this.executeQuery(async () =>
        this.markStudioReadQuery(feedbackReportId, lastSeenMessageAt),
      )
    }
  }

  private async markAuthorAsRead(
    feedbackReportId: Id,
    lastSeenMessageAt: Date,
    authorId: Id | undefined,
  ): Promise<void> {
    if (!authorId) throw new AuthError('Conta não autorizada')
    this.authorizeOwner(authorId)
    await this.executeQuery(async () =>
      this.markAuthorReadQuery(feedbackReportId, lastSeenMessageAt, authorId),
    )
  }

  private authorReadFilter(feedbackReportId: Id, lastSeenMessageAt: Date, authorId: Id) {
    return and(
      this.authorReportFilter(feedbackReportId, authorId),
      isNotNull(feedbackReportModel.lastAdminMessageAt),
      lte(
        sql`${lastSeenMessageAt.toISOString()}::timestamptz`,
        feedbackReportModel.lastAdminMessageAt,
      ),
    )
  }

  private markAuthorReadQuery(
    feedbackReportId: Id,
    lastSeenMessageAt: Date,
    authorId: Id,
  ) {
    return this.database
      .update(feedbackReportModel)
      .set({
        authorReadAt: sql`greatest(${feedbackReportModel.authorReadAt}, ${lastSeenMessageAt.toISOString()})`,
      })
      .where(this.authorReadFilter(feedbackReportId, lastSeenMessageAt, authorId))
  }

  private markStudioReadQuery(feedbackReportId: Id, lastSeenMessageAt: Date) {
    return this.database
      .update(feedbackReportModel)
      .set({
        studioReadAt: sql`greatest(${feedbackReportModel.studioReadAt}, ${lastSeenMessageAt.toISOString()})`,
      })
      .where(eq(feedbackReportModel.id, feedbackReportId.value))
  }
}
