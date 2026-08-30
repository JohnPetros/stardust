import type { SupabaseClient } from '@supabase/supabase-js'
import { Id, OrdinalNumber } from '@stardust/core/global/structures'

import type { Database } from '@/database/supabase/types/Database'
import { SupabaseFeedbackReportsRepository } from '@/database/supabase/repositories/reporting/SupabaseFeedbackReportsRepository'

describe('SupabaseFeedbackReportsRepository.list', () => {
  it('uses one RPC response for an empty page and keeps its global metadata', async () => {
    const rpc = jest.fn().mockResolvedValue({
      data: [
        {
          id: null,
          total_count: 7,
          summary_total: 12,
          summary_open: 8,
          summary_closed: 4,
          summary_unread: 3,
        },
      ],
      error: null,
    })
    const client = { rpc } as unknown as SupabaseClient<Database>
    const repository = new SupabaseFeedbackReportsRepository(client)

    await expect(repository.list({})).resolves.toEqual({
      items: [],
      page: 1,
      itemsPerPage: 20,
      total: 7,
      summary: { total: 12, open: 8, closed: 4, unread: 3 },
    })
    expect(rpc).toHaveBeenCalledTimes(1)
  })

  it('maps the owning user returned by the feedback history RPC', async () => {
    const rpc = jest.fn().mockResolvedValue({
      data: [
        {
          id: '00000000-0000-4000-8000-000000000001',
          content: 'Feedback content',
          intent: 'bug',
          screenshot: null,
          user_id: '00000000-0000-4000-8000-000000000002',
          title: 'Feedback title',
          status: 'open',
          created_at: '2026-08-06T00:00:00.000Z',
          last_activity_at: '2026-08-06T00:00:00.000Z',
          last_user_message_at: null,
          studio_read_at: null,
          last_admin_message_at: null,
          author_read_at: null,
          admin_message_count: 0,
          is_unread: false,
          preview: 'Feedback content',
          total_count: 1,
          author_name: 'Petros',
          author_email: 'petros@example.com',
          author_slug: 'petros',
          avatar_name: 'Astronaut',
          avatar_image: '/images/astronaut.svg',
        },
      ],
      error: null,
    })
    const client = { rpc } as unknown as SupabaseClient<Database>
    const repository = new SupabaseFeedbackReportsRepository(client)

    const result = await repository.listByAuthor({
      authorId: Id.create('00000000-0000-4000-8000-000000000002'),
      page: OrdinalNumber.create(1),
      itemsPerPage: OrdinalNumber.create(10),
    })

    expect(result.items[0]?.dto.author.entity).toEqual(
      expect.objectContaining({ name: 'Petros', slug: 'petros' }),
    )
    expect(result.items[0]?.dto.author.entity?.avatar).toEqual({
      name: 'Astronaut',
      image: '/images/astronaut.svg',
    })
  })
})
