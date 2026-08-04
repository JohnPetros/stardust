import { execFileSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

const sql = (query: string) =>
  execFileSync(
    'psql',
    [
      process.env.SUPABASE_DATABASE_URL ??
        'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
      '-At',
      '-v',
      'ON_ERROR_STOP=1',
      '-c',
      query,
    ],
    { encoding: 'utf8' },
  ).trim()

describe('feedback conversation account cascade', () => {
  it('deletes a user and cascades report, message, and attachment', () => {
    const userId = randomUUID()
    const reportId = randomUUID()
    const messageId = randomUUID()
    const attachmentId = randomUUID()

    try {
      sql(
        `insert into public.users (id, name, email, slug, tier_id, rocket_id, avatar_id)
         values ('${userId}', 'Cascade ${userId}', '${userId}@example.test', 'cascade-${userId}', null, null, null)`,
      )
      sql(
        `insert into public.feedback_reports (id, content, intent, user_id, title, last_activity_at)
         values ('${reportId}', 'Cascade report', 'bug', '${userId}', 'Cascade report', now())`,
      )
      sql(
        `insert into public.feedback_messages (id, report_id, author_role, author_id, content)
         values ('${messageId}', '${reportId}', 'admin', '${userId}', 'Cascade reply')`,
      )
      sql(
        `insert into public.feedback_message_attachments
          (id, message_id, storage_key, original_name, mime_type, size, position)
         values ('${attachmentId}', '${messageId}', 'feedback/${attachmentId}.png', 'evidence.png', 'image/png', 1, 0)`,
      )

      expect(
        sql(`select count(*) from public.feedback_reports where id = '${reportId}'`),
      ).toBe('1')
      expect(
        sql(`select count(*) from public.feedback_messages where id = '${messageId}'`),
      ).toBe('1')
      expect(
        sql(
          `select count(*) from public.feedback_message_attachments where id = '${attachmentId}'`,
        ),
      ).toBe('1')

      sql(`delete from public.users where id = '${userId}'`)

      expect(
        sql(`select count(*) from public.feedback_reports where id = '${reportId}'`),
      ).toBe('0')
      expect(
        sql(`select count(*) from public.feedback_messages where id = '${messageId}'`),
      ).toBe('0')
      expect(
        sql(
          `select count(*) from public.feedback_message_attachments where id = '${attachmentId}'`,
        ),
      ).toBe('0')
    } finally {
      sql(`delete from public.users where id = '${userId}'`)
      sql(`delete from public.feedback_reports where id = '${reportId}'`)
    }
  })
})
