import { execFileSync } from 'node:child_process'
import type { SupabaseClient } from '@supabase/supabase-js'

import type { AvatarDto, InsigniaDto, RocketDto } from '@stardust/core/shop/entities/dtos'

import { ENV } from '@/constants'

type PersistedAvatar = Omit<AvatarDto, 'isPurchasable'> & { id: string }
type PersistedRocket = Omit<Required<RocketDto>, 'isPurchasable'> & {
  isPurchasable: boolean
}
type PersistedInsignia = Required<InsigniaDto>

export class ShopFixture {
  constructor(private readonly supabase: SupabaseClient) {}

  async createAvatars(avatars: AvatarDto[]): Promise<void> {
    const { error } = await this.supabase.from('avatars').insert(
      avatars.map((avatar) => ({
        id: avatar.id,
        name: avatar.name,
        image: avatar.image,
        price: avatar.price,
        is_acquired_by_default: avatar.isAcquiredByDefault ?? false,
        is_selected_by_default: avatar.isSelectedByDefault ?? false,
      })),
    )

    if (error) {
      throw error
    }
  }

  async getAvatarById(avatarId: string): Promise<PersistedAvatar | null> {
    const { data, error } = await this.supabase
      .from('avatars')
      .select('id, name, image, price, is_acquired_by_default, is_selected_by_default')
      .eq('id', avatarId)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!data) {
      return null
    }

    return {
      id: data.id,
      name: data.name,
      image: data.image,
      price: data.price,
      isAcquiredByDefault: data.is_acquired_by_default,
      isSelectedByDefault: data.is_selected_by_default,
    }
  }

  async createRockets(rockets: RocketDto[]): Promise<void> {
    const { error } = await this.supabase.from('rockets').insert(
      rockets.map((rocket) => ({
        id: rocket.id,
        name: rocket.name,
        image: rocket.image,
        price: rocket.price,
        is_acquired_by_default: rocket.isAcquiredByDefault ?? false,
        is_selected_by_default: rocket.isSelectedByDefault ?? false,
      })),
    )

    if (error) {
      throw error
    }
  }

  async getRocketById(rocketId: string): Promise<PersistedRocket | null> {
    const { data, error } = await this.supabase
      .from('rockets')
      .select('id, name, image, price, is_acquired_by_default, is_selected_by_default')
      .eq('id', rocketId)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!data) {
      return null
    }

    return {
      id: data.id,
      name: data.name,
      image: data.image,
      price: data.price,
      isPurchasable: true,
      isAcquiredByDefault: data.is_acquired_by_default,
      isSelectedByDefault: data.is_selected_by_default,
    }
  }

  async createInsignias(insignias: InsigniaDto[]): Promise<void> {
    const ids = insignias.map((insignia) => `'${insignia.id}'`).join(', ')
    const roles = insignias.map((insignia) => `'${insignia.role}'`).join(', ')
    const values = insignias
      .map((insignia) => {
        const name = insignia.name.replaceAll("'", "''")
        const image = insignia.image.replaceAll("'", "''")

        return `('${insignia.id}', '${name}', ${insignia.price}, '${image}', '${insignia.role}', ${insignia.isPurchasable ?? false})`
      })
      .join(', ')

    execFileSync('psql', [
      ENV.databaseUrl,
      '-c',
      `delete from public.insignias where id in (${ids}) or role in (${roles}); insert into public.insignias (id, name, price, image, role, is_purchasable) values ${values};`,
    ])
  }

  async getInsigniaById(insigniaId: string): Promise<PersistedInsignia | null> {
    const { data, error } = await this.supabase
      .from('insignias')
      .select('*')
      .eq('id', insigniaId)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!data) {
      return null
    }

    return {
      id: data.id,
      name: data.name,
      image: data.image,
      price: data.price,
      role: data.role,
      isPurchasable: data.is_purchasable,
    }
  }
}
