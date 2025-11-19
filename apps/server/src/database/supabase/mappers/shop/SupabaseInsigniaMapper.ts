import { Insignia } from '@stardust/core/shop/entities'
import type { InsigniaDto } from '@stardust/core/shop/entities/dtos'

import type { SupabaseInsignia } from '../../types'

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
    }

    return dto
  }

  static toSupabase(insignia: Insignia): SupabaseInsignia {
    const insigniaDto = insignia.dto

    const supabaseInsignia: SupabaseInsignia = {
      id: insignia.id.value,
      name: insigniaDto.name,
      image: insigniaDto.image,
      price: insigniaDto.price,
      role: 'engineer',
    }

    return supabaseInsignia
  }
}
