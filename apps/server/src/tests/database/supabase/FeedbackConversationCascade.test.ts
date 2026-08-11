import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('feedback conversation account cascade', () => {
  it('keeps the cascade contract in the versioned schema', () => {
    const schema = readFileSync(
      resolve(process.cwd(), 'supabase/schemas/schema.sql'),
      'utf8',
    )

    expect(schema).toMatch(
      /feedback_reports[\s\S]*?references public\.users\(id\) on update cascade on delete cascade/i,
    )
    expect(schema).toMatch(
      /feedback_messages[\s\S]*?references public\.feedback_reports\(id\) on delete cascade/i,
    )
    expect(schema).toMatch(
      /feedback_message_attachments[\s\S]*?references public\.feedback_messages\(id\) on delete cascade/i,
    )
  })
})
