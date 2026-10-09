import type { SupabaseClient } from '@supabase/supabase-js'
import { eq, inArray, or } from 'drizzle-orm'
import type { AvatarDto, InsigniaDto, RocketDto } from '@stardust/core/shop/entities/dtos'
import { InsigniaRole } from '@stardust/core/global/structures'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { avatarModel, rocketModel, insigniaModel } from '@/database/drizzle/schema'

type PersistedAvatar = Omit<AvatarDto, 'isPurchasable'> & { id: string }
type PersistedRocket = Omit<Required<RocketDto>, 'isPurchasable'> & {
  isPurchasable: boolean
}
type PersistedInsignia = Required<InsigniaDto>

export class ShopFixture {
  constructor(_supabase: SupabaseClient) {}
  private get database() {
    return DrizzleClient.getInstance()
  }

  async createAvatars(avatars: AvatarDto[]): Promise<void> {
    if (!avatars.length) return
    await this.database.insert(avatarModel).values(
      avatars.map((avatar) => ({
        id: avatar.id,
        name: avatar.name,
        image: avatar.image,
        price: avatar.price,
        isAcquiredByDefault: avatar.isAcquiredByDefault ?? false,
        isSelectedByDefault: avatar.isSelectedByDefault ?? false,
      })),
    )
  }
  async getAvatarById(avatarId: string): Promise<PersistedAvatar | null> {
    const [row] = await this.database
      .select()
      .from(avatarModel)
      .where(eq(avatarModel.id, avatarId))
    if (!row) return null
    const { isPurchasable: _isPurchasable, ...avatar } = row
    return avatar
  }
  async createRockets(rockets: RocketDto[]): Promise<void> {
    if (!rockets.length) return
    await this.database.insert(rocketModel).values(
      rockets.map((rocket) => ({
        id: rocket.id,
        name: rocket.name,
        image: rocket.image,
        price: rocket.price,
        isAcquiredByDefault: rocket.isAcquiredByDefault ?? false,
        isSelectedByDefault: rocket.isSelectedByDefault ?? false,
      })),
    )
  }
  async getRocketById(rocketId: string): Promise<PersistedRocket | null> {
    const [row] = await this.database
      .select()
      .from(rocketModel)
      .where(eq(rocketModel.id, rocketId))
    return row ? { ...row, isPurchasable: true } : null
  }
  async createInsignias(insignias: InsigniaDto[]): Promise<void> {
    if (!insignias.length) return
    await this.database.transaction(async (transaction) => {
      await transaction.delete(insigniaModel).where(
        or(
          inArray(
            insigniaModel.id,
            insignias.map((item) => item.id ?? ''),
          ),
          inArray(
            insigniaModel.role,
            insignias.map((item) => InsigniaRole.create(item.role).value),
          ),
        ),
      )
      await transaction.insert(insigniaModel).values(
        insignias.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          role: InsigniaRole.create(item.role).value,
          isPurchasable: item.isPurchasable ?? false,
        })),
      )
    })
  }
  async getInsigniaById(insigniaId: string): Promise<PersistedInsignia | null> {
    const [row] = await this.database
      .select()
      .from(insigniaModel)
      .where(eq(insigniaModel.id, insigniaId))
    return row ?? null
  }
}
