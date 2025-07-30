import { useRef, useState, type RefObject } from 'react'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { Image, OrdinalNumber, Text } from '@stardust/core/global/structures'
import type { StorageService } from '@stardust/core/storage/interfaces'
import type { DialogRef } from '@/ui/shadcn/components/dialog'

const ITEMS_PER_PAGE = OrdinalNumber.create(30)

export function useStoryImageInput(
  storageService: StorageService,
  dialogRef: RefObject<DialogRef | null>,
) {
  const [selectedImage, setSelectedImage] = useState<Image>(Image.create('panda.jpg'))
  const [search, setSearch] = useState<Text>(Text.create(''))
  const containerRef = useRef<HTMLDivElement>(null)
  const { data, isFetching, isFetchingNextPage, hasNextPage, nextPage, refetch } =
    usePaginatedCache<string>({
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
      shouldRefetchOnFocus: false,
      isInfinity: true,
    })

  function handleSearchInputChange(search: string) {
    setSearch(Text.create(search))
  }

  function handleImageCardClick(imageName: string) {
    setSelectedImage(Image.create(imageName))
    dialogRef.current?.close()
  }

  function handleLoadMoreButtonClick() {
    nextPage()
  }

  function handleImageSubmit() {
    refetch()
  }

  function handleImageCardRemove() {
    refetch()
  }

  return {
    images: data ? data.map((image) => Image.create(image)) : [],
    selectedImage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    containerRef,
    handleSearchInputChange,
    handleImageCardClick,
    handleImageCardRemove,
    handleImageSubmit,
    handleLoadMoreButtonClick,
  }
}
