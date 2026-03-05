import type { Insignia } from '@stardust/core/shop/entities'
import type { InsigniasRepository } from '@stardust/core/shop/interfaces'
import type { Id, InsigniaRole } from '@stardust/core/global/structures'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseInsigniaMapper } from '../../mappers/shop'
import { SupabasePostgreError } from '../../errors'

export class SupabaseInsigniasRepository
  extends SupabaseRepository
  implements InsigniasRepository
{
  async findById(insigniaId: Id): Promise<Insignia | null> {
    const { data, error } = await this.supabase
      .from('insignias')
      .select('*')
      .eq('id', insigniaId.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }
    return SupabaseInsigniaMapper.toEntity(data)
  }

  async findByRole(role: InsigniaRole): Promise<Insignia | null> {
    const { data, error } = await this.supabase
      .from('insignias')
      .select('*')
      .eq('role', role.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }
    return SupabaseInsigniaMapper.toEntity(data)
  }

  async findAll() {
    const { data, error } = await this.supabase.from('insignias').select('*')

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseInsigniaMapper.toEntity)
  }

  async findAllPurchasable() {
    const { data, error } = await this.supabase
      .from('insignias')
      .select('*')
      .or('is_purchasable.eq.true,and(is_purchasable.is.null,role.neq.god)')

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseInsigniaMapper.toEntity)
  }

  async add(insignia: Insignia): Promise<void> {
    const supabaseInsignia = SupabaseInsigniaMapper.toSupabase(insignia)
    const { error } = await this.supabase.from('insignias').insert({
      id: insignia.id.value,
      name: supabaseInsignia.name,
      image: supabaseInsignia.image,
      price: supabaseInsignia.price,
      role: supabaseInsignia.role,
      is_purchasable: supabaseInsignia.is_purchasable,
    })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replace(insignia: Insignia): Promise<void> {
    const supabaseInsignia = SupabaseInsigniaMapper.toSupabase(insignia)
    const { error } = await this.supabase
      .from('insignias')
      .update({
        name: supabaseInsignia.name,
        image: supabaseInsignia.image,
        price: supabaseInsignia.price,
        role: supabaseInsignia.role,
        is_purchasable: supabaseInsignia.is_purchasable,
      })
      .eq('id', insignia.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async remove(insigniaId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('insignias')
      .delete()
      .eq('id', insigniaId.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
