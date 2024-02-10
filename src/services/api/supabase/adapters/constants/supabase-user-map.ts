import type { SupabaseUser } from '../../types/SupabaseUser'

import { User } from '@/@types/User'

const SUPABASE_USER_MAP: Record<keyof SupabaseUser, keyof User> = {
  acquired_rockets_count: 'acquiredRocketsCount',
}
