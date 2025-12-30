import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type { Guide } from '@stardust/core/manual/entities'
import type { GuideCategory } from '@stardust/core/manual/structures'
import type { Id } from '@stardust/core/global/structures'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseGuideMapper } from '../../mappers/manual'
import { SupabasePostgreError } from '../../errors'

export class SupabaseGuidesRepository
  extends SupabaseRepository
  implements GuidesRepository
{
  async findById(id: Id): Promise<Guide | null> {
    const { data, error } = await this.supabase
      .from('guides')
      .select('*')
      .eq('id', id.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }
    return SupabaseGuideMapper.toEntity(data)
  }

  async findAll(): Promise<Guide[]> {
    const { data, error } = await this.supabase
      .from('guides')
      .select('*')
      .order('position', { ascending: true })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseGuideMapper.toEntity)
  }

  async findAllByCategory(category: GuideCategory): Promise<Guide[]> {
    const { data, error } = await this.supabase
      .from('guides')
      .select('*')
      .eq('category', category.value)
      .order('position', { ascending: true })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseGuideMapper.toEntity)
  }

  async findLastByPositionAndCategory(category: GuideCategory): Promise<Guide | null> {
    const { data, error } = await this.supabase
      .from('guides')
      .select('*')
      .eq('category', category.value)
      .order('position', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }
    return SupabaseGuideMapper.toEntity(data)
  }

  async add(guide: Guide): Promise<void> {
    const supabaseGuide = SupabaseGuideMapper.toSupabase(guide)
    const { error } = await this.supabase.from('guides').insert({
      id: guide.id.value,
      title: supabaseGuide.title,
      content: supabaseGuide.content,
      position: supabaseGuide.position,
      category: supabaseGuide.category,
    })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replace(guide: Guide): Promise<void> {
    const supabaseGuide = SupabaseGuideMapper.toSupabase(guide)
    const { error } = await this.supabase
      .from('guides')
      .update({
        title: supabaseGuide.title,
        content: supabaseGuide.content,
        position: supabaseGuide.position,
        category: supabaseGuide.category,
      })
      .eq('id', guide.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replaceMany(guides: Guide[]): Promise<void> {
    const supabaseGuides = guides.map((guide) => {
      const dto = SupabaseGuideMapper.toSupabase(guide)
      return {
        id: guide.id.value,
        title: dto.title,
        content: dto.content,
        position: dto.position,
        category: dto.category,
      }
    })

    const { error } = await this.supabase.from('guides').upsert(supabaseGuides)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async remove(guide: Guide): Promise<void> {
    const { error } = await this.supabase.from('guides').delete().eq('id', guide.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
