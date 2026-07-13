import type { User, UserIdentity } from '@supabase/supabase-js'

import { SupabaseAuthService } from '../SupabaseAuthService'
import type { Supabase } from '@/database/supabase/types'

function makeIdentity(
  provider: 'github' | 'google',
  identityData: Record<string, unknown>,
  lastSignInAt: string,
): UserIdentity {
  return {
    id: `${provider}-id`,
    user_id: 'account-id',
    identity_id: `${provider}-identity-id`,
    provider,
    identity_data: identityData,
    created_at: lastSignInAt,
    updated_at: lastSignInAt,
    last_sign_in_at: lastSignInAt,
    email: 'account@stardust.dev',
  } as UserIdentity
}

function makeUser(user: Partial<User>): User {
  return {
    id: 'account-id',
    email: 'account@stardust.dev',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2026-07-13T20:00:00.000Z',
    ...user,
  } as User
}

function makeSupabase(user: User | null): Supabase {
  return {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user },
        error: null,
      }),
    },
  } as unknown as Supabase
}

describe('SupabaseAuthService', () => {
  it('should retrieve the account name from the latest Google identity', async () => {
    const user = makeUser({
      app_metadata: { provider: 'github', providers: ['github', 'google'] },
      user_metadata: {
        full_name: 'Metadata Name',
        user_name: 'metadata-login',
      },
      identities: [
        makeIdentity(
          'github',
          { user_name: 'github-login', full_name: 'Github Name' },
          '2026-07-13T20:11:54.221Z',
        ),
        makeIdentity(
          'google',
          { full_name: 'Google Name', user_name: 'google-login' },
          '2026-07-13T20:21:46.888Z',
        ),
      ],
    })
    const service = new SupabaseAuthService(makeSupabase(user))

    const response = await service.fetchAccount()

    expect(response.body.name).toBe('Google Name')
  })

  it('should fall back to user metadata when the latest Google identity has no name', async () => {
    const user = makeUser({
      user_metadata: {
        full_name: 'Metadata Name',
      },
      identities: [makeIdentity('google', {}, '2026-07-13T20:21:46.888Z')],
    })
    const service = new SupabaseAuthService(makeSupabase(user))

    const response = await service.fetchAccount()

    expect(response.body.name).toBe('Metadata Name')
  })

  it('should retrieve the account name from the latest Github identity', async () => {
    const user = makeUser({
      app_metadata: { provider: 'google', providers: ['google', 'github'] },
      user_metadata: {
        full_name: 'Metadata Name',
      },
      identities: [
        makeIdentity(
          'google',
          { full_name: 'Google Name', user_name: 'google-login' },
          '2026-07-13T20:11:54.221Z',
        ),
        makeIdentity(
          'github',
          { user_name: 'github-login', full_name: 'Github Name' },
          '2026-07-13T20:21:46.888Z',
        ),
      ],
    })
    const service = new SupabaseAuthService(makeSupabase(user))

    const response = await service.fetchAccount()

    expect(response.body.name).toBe('github-login')
  })

  it('should fall back to user metadata when the latest Github identity has no name', async () => {
    const user = makeUser({
      user_metadata: {
        user_name: 'metadata-login',
      },
      identities: [makeIdentity('github', {}, '2026-07-13T20:21:46.888Z')],
    })
    const service = new SupabaseAuthService(makeSupabase(user))

    const response = await service.fetchAccount()

    expect(response.body.name).toBe('metadata-login')
  })

  it('should keep the first identity when it is newer than the next identity', async () => {
    const user = makeUser({
      identities: [
        makeIdentity(
          'google',
          { full_name: 'Latest Google Name' },
          '2026-07-13T20:21:46.888Z',
        ),
        makeIdentity(
          'github',
          { user_name: 'older-github-login' },
          '2026-07-13T20:11:54.221Z',
        ),
      ],
    })
    const service = new SupabaseAuthService(makeSupabase(user))

    const response = await service.fetchAccount()

    expect(response.body.name).toBe('Latest Google Name')
  })

  it('should use the identity creation timestamp when last sign in is missing', async () => {
    const user = makeUser({
      identities: [
        {
          ...makeIdentity(
            'github',
            { user_name: 'github-login' },
            '2026-07-13T20:21:46.888Z',
          ),
          last_sign_in_at: undefined,
        } as UserIdentity,
      ],
    })
    const service = new SupabaseAuthService(makeSupabase(user))

    const response = await service.fetchAccount()

    expect(response.body.name).toBe('github-login')
  })

  it('should fall back to user metadata when the provider is unknown', async () => {
    const user = makeUser({
      user_metadata: {
        full_name: 'Metadata Name',
      },
      identities: [],
    })
    const service = new SupabaseAuthService(makeSupabase(user))

    const response = await service.fetchAccount()

    expect(response.body.name).toBe('Metadata Name')
  })

  it('should return an empty account when Supabase has no authenticated user', async () => {
    const service = new SupabaseAuthService(makeSupabase(null))

    const response = await service.fetchAccount()

    expect(response.body).toEqual({
      id: '',
      email: '',
      name: '',
      isAuthenticated: true,
    })
  })
})
