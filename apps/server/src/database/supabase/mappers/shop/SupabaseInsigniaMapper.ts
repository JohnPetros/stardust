import { Insignia } from '@stardust/core/shop/entities'
import type { InsigniaDto } from '@stardust/core/shop/entities/dtos'

import type { Database, SupabaseInsignia, SupabaseInsigniaRole } from '../../types'

type SupabaseInsigniaPayload = Database['public']['Tables']['insignias']['Insert']

export class SupabaseInsigniaMapper {
  static toEntity(supabaseInsignia: SupabaseInsignia): Insignia {
    return Insignia.create(SupabaseInsigniaMapper.toDto(supabaseInsignia))
  }

  static toDto(supabaseInsignia: SupabaseInsignia): InsigniaDto {
    const dto: InsigniaDto = {
      id: supabaseInsignia.id,
      name: supabaseInsignia.name,
      image: supabaseInsignia.image,
      price: supabaseInsignia.price,
      role: supabaseInsignia.role,
      isPurchasable: supabaseInsignia.is_purchasable,
    }

    return dto
  }

  static toSupabase(insignia: Insignia): SupabaseInsigniaPayload {
    const insigniaDto = insignia.dto

    const supabaseInsignia: SupabaseInsigniaPayload = {
      id: insignia.id.value,
      name: insigniaDto.name,
      image: insigniaDto.image,
      price: insigniaDto.price,
      role: insigniaDto.role as SupabaseInsigniaRole,
      is_purchasable: insigniaDto.isPurchasable ?? false,
    }

    return supabaseInsignia
  }
}
