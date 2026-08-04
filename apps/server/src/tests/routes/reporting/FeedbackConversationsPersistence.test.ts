import { execFileSync, spawnSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { ENV } from '@/constants'

const sql = (query: string) =>
  execFileSync('psql', [ENV.databaseUrl, '-At', '-v', 'ON_ERROR_STOP=1', '-c', query], {
    encoding: 'utf8',
  }).trim()

describe('feedback conversation persistence', () => {
  it('keeps the legacy report and applies the migration invariants', () => {
    expect(
      sql(
        "select count(*) from public.feedback_reports where title is not null and status in ('open', 'closed') and last_activity_at is not null",
      ),
    ).toBe(sql('select count(*) from public.feedback_reports'))
    expect(
      sql(
        "select count(*) from information_schema.routines where routine_schema = 'public' and routine_name in ('list_feedback_reports','change_feedback_report_status') and security_type = 'INVOKER'",
      ),
    ).toBe('2')
    expect(
      sql(
        'select count(*) from public.list_feedback_reports(null::text, null::public.feedback_intent, null::text, null::timestamptz, null::timestamptz, 999, 20)',
      ),
    ).toBe('1')
    expect(
      sql(
        "select (id is null)::text || ':' || total_count || ':' || summary_total from public.list_feedback_reports(null::text, null::public.feedback_intent, null::text, null::timestamptz, null::timestamptz, 999, 20)",
      ),
    ).toBe('true:0:0')
  })

  it('has the queue indexes and cascades required by the persistence contract', () => {
    expect(
      sql(
        "select string_agg(indexname, ',' order by indexname) from pg_indexes where schemaname = 'public' and indexname in ('feedback_reports_queue_idx','feedback_reports_unread_idx','feedback_reports_user_idx','feedback_messages_report_idx','feedback_message_attachments_message_idx')",
      ),
    ).toBe(
      'feedback_message_attachments_message_idx,feedback_messages_report_idx,feedback_reports_queue_idx,feedback_reports_unread_idx,feedback_reports_user_idx',
    )
    expect(
      sql(
        "select count(*) from pg_constraint where conrelid in ('public.feedback_messages'::regclass,'public.feedback_message_attachments'::regclass) and confdeltype = 'c'",
      ),
    ).toBe('2')
  })

  it('persists message, attachment, and status through separate boundaries', () => {
    const reportId = randomUUID()
    const messageId = randomUUID()
    const attachmentId = randomUUID()
    const invalidReportId = randomUUID()
    const authorId = randomUUID()
    sql(
      `insert into public.users (id, name, email, slug, tier_id, rocket_id, avatar_id) values ('${authorId}', 'Feedback Persistence User ${authorId}', '${authorId}@example.test', 'feedback-persistence-${authorId}', null, null, null)`,
    )

    sql(
      `insert into public.feedback_reports (id, content, intent, user_id, title, status, last_activity_at) values ('${reportId}', 'Persistence test report', 'bug', '${authorId}', 'Persistence test report', 'open', now())`,
    )

    try {
      sql(`insert into public.feedback_messages (id, report_id, author_role, author_id, content)
        values ('${messageId}', '${reportId}', 'admin', '${authorId}', 'Canonical reply')`)
      sql(`insert into public.feedback_message_attachments
        (id, message_id, storage_key, original_name, mime_type, size, position)
        values ('${attachmentId}', '${messageId}', 'feedback/${attachmentId}.png', 'evidence.png', 'image/png', 128, 0)`)
      expect(
        sql(
          `select count(*) from public.feedback_messages where id = '${messageId}' and report_id = '${reportId}' and author_role = 'admin'`,
        ),
      ).toBe('1')
      expect(
        sql(
          `select count(*) from public.feedback_message_attachments where id = '${attachmentId}' and message_id = '${messageId}' and size = 128`,
        ),
      ).toBe('1')
      expect(
        sql(`select status from public.feedback_reports where id = '${reportId}'`),
      ).toBe('closed')
      const statusRequest = JSON.stringify({
        reportId,
        expectedStatus: 'closed',
        status: 'open',
      }).replaceAll("'", "''")
      expect(
        sql(
          `select (public.change_feedback_report_status('${statusRequest}'::jsonb)->>'status')`,
        ),
      ).toBe('open')

      const invalidMessageId = randomUUID()
      sql(
        `insert into public.feedback_reports (id, content, intent, user_id, title, status, last_activity_at) values ('${invalidReportId}', 'Invalid attachment report', 'bug', '${authorId}', 'Invalid attachment report', 'open', now())`,
      )
      const invalid = spawnSync(
        'psql',
        [
          ENV.databaseUrl,
          '-v',
          'ON_ERROR_STOP=0',
          '-c',
          `insert into public.feedback_message_attachments (id, message_id, storage_key, original_name, mime_type, size, position) values ('${randomUUID()}', '${invalidMessageId}', 'feedback/test.png', 'test.png', 'image/png', 0, 0);`,
        ],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
      )
      expect(invalid.status).not.toBe(0)
      expect(
        sql(
          `select count(*) from public.feedback_messages where report_id = '${invalidReportId}'`,
        ),
      ).toBe('0')
      expect(
        sql(
          `select count(*) from public.feedback_message_attachments where message_id = '${invalidMessageId}'`,
        ),
      ).toBe('0')
      expect(
        sql(`select status from public.feedback_reports where id = '${invalidReportId}'`),
      ).toBe('open')

      expect(
        sql(
          'select count(*) from public.list_feedback_reports(null::text, null::public.feedback_intent, null::text, null::timestamptz, null::timestamptz, 1, 100000)',
        ),
      ).toBe(sql('select count(*) from public.feedback_reports'))

      // Exercise the real account lifecycle: users -> reports -> conversation.
      // The delete must cascade through reports, messages, and attachments.
      sql(`delete from public.users where id = '${authorId}'`)
      expect(
        sql(`select count(*) from public.feedback_reports where user_id = '${authorId}'`),
      ).toBe('0')
      expect(
        sql(
          `select count(*) from public.feedback_messages where report_id = '${reportId}'`,
        ),
      ).toBe('0')
      expect(
        sql(
          `select count(*) from public.feedback_message_attachments where message_id = '${messageId}'`,
        ),
      ).toBe('0')
      expect(
        sql(
          `select count(*) from public.feedback_reports where id in ('${reportId}', '${invalidReportId}')`,
        ),
      ).toBe('0')
    } finally {
      sql(
        `delete from public.feedback_reports where id in ('${reportId}', '${invalidReportId}')`,
      )
      sql(`delete from public.users where id = '${authorId}'`)
    }
  })
})
