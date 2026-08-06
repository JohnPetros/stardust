import type { SupabaseClient } from '@supabase/supabase-js'

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
})
