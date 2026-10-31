import { IdsList, Id } from '@stardust/core/global/structures'
import { Guide } from '@stardust/core/manual/entities'
import type { GuideCategory } from '@stardust/core/manual/structures'
import type { GuideDto } from '@stardust/core/manual/entities/dtos'
import type { ManualService } from '@stardust/core/manual/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'

import { CACHE } from '@/constants/cache'
import { useFetch } from '@/ui/global/hooks/useFetch'
import type { SortableItem } from '@/ui/global/widgets/components/SortableGrid/types'

type Params = {
  manualService: ManualService
  toast: ToastProvider
  category: GuideCategory
}

export function useGuidesPage({ manualService, toast, category }: Params) {
  const {
    data: guidesDto,
    isLoading,
    refetch,
  } = useFetch<GuideDto[]>({
    key: CACHE.guidesGrid.key,
    fetcher: () => manualService.fetchGuidesByCategory(category),
    dependencies: [category.value],
  })

  async function handleDragEnd(reorderedGuides: SortableItem<GuideDto>[]) {
    const ids = IdsList.create(reorderedGuides.map((item) => item.id))
    const response = await manualService.reorderGuides(ids)

    if (response.isFailure) {
      toast.showError(response.errorMessage)
      return
    }

    refetch()
  }

  async function handleCreateGuide(title: string) {
    const response = await manualService.createGuide(category, title)

    if (response.isFailure) {
      toast.showError(response.errorMessage)
      return
    }

    refetch()
    toast.showSuccess('Guia criado com sucesso!')
  }

  async function handleRenameGuide(guideDto: GuideDto, title: string) {
    const guide = Guide.create({ ...guideDto, title })
    const response = await manualService.editGuideTitle(guide)

    if (response.isFailure) {
      toast.showError(response.errorMessage)
      return
    }

    refetch()
    toast.showSuccess('Guia renomeada com sucesso!')
  }

  async function handleDeleteGuide(guideId: string) {
    const response = await manualService.deleteGuide(Id.create(guideId))

    if (response.isFailure) {
      toast.showError(response.errorMessage)
      return
    }

    refetch()
    toast.showSuccess('Guia excluído com sucesso!')
  }

  const guides: SortableItem<GuideDto>[] = (guidesDto ?? [])
    .filter((guide) => !!guide.id)
    .map((guide) => ({
      id: guide.id as string,
      data: guide,
    }))

  return {
    guides,
    isLoading,
    onDragEnd: handleDragEnd,
    onCreateGuide: handleCreateGuide,
    onRenameGuide: handleRenameGuide,
    onDeleteGuide: handleDeleteGuide,
  }
}
