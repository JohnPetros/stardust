import { useState } from 'react'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { Image, OrdinalNumber, Text } from '@stardust/core/global/structures'
import type { StorageService } from '@stardust/core/storage/interfaces'

const ITEMS_PER_PAGE = OrdinalNumber.create(30)

export function useStoryImageInput(storageService: StorageService) {
  const [selectedImage, setSelectedImage] = useState<Image>(Image.create('panda.jpg'))
  const [search, setSearch] = useState<Text>(Text.create(''))

  const { data, isLoading } = usePaginatedCache<string>({
    key: CACHE.storyImages.key,
    fetcher: async (page: number) =>
      await storageService.listFiles({
        folder: 'story',
        search: search,
        page: OrdinalNumber.create(page),
        itemsPerPage: ITEMS_PER_PAGE,
      }),
    dependencies: [search.value, selectedImage.value],
    itemsPerPage: ITEMS_PER_PAGE.value,
    isInfinity: true,
  })

  function handleSearchInputChange(search: string) {
    setSearch(Text.create(search))
  }

  function handleImageCardClick(imageName: string) {
    setSelectedImage(Image.create(imageName))
  }

  return {
    images: data ? data.map((image) => Image.create(image)) : [],
    selectedImage,
    isLoading,
    handleSearchInputChange,
    handleImageCardClick,
  }
}
