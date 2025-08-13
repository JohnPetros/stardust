import { useRef, useState, type RefObject } from 'react'

import type { StorageService } from '@stardust/core/storage/interfaces'
import type { DialogRef } from '@/ui/shadcn/components/dialog'
import { StorageFolder } from '@stardust/core/storage/structures'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { Image, OrdinalNumber, Text } from '@stardust/core/global/structures'

const ITEMS_PER_PAGE = OrdinalNumber.create(30)

type Props = {
  defaultPicture?: Image
  storageService: StorageService
  dialogRef: RefObject<DialogRef | null>
  onChange: (picture: Image) => void
}

export function usePictureInput({
  defaultPicture,
  storageService,
  dialogRef,
  onChange,
}: Props) {
  const [selectedImage, setSelectedImage] = useState<Image>(
    defaultPicture ?? Image.create('panda.jpg'),
  )
  const [search, setSearch] = useState<Text>(Text.create(''))
  const containerRef = useRef<HTMLDivElement>(null)
  const { data, isFetching, isFetchingNextPage, hasNextPage, nextPage, refetch } =
    usePaginatedCache<string>({
      key: CACHE.storyPictures.key,
      fetcher: async (page: number) =>
        await storageService.listFiles({
          search: search,
          folder: StorageFolder.createAsStory(),
          page: OrdinalNumber.create(page),
          itemsPerPage: ITEMS_PER_PAGE,
        }),
      dependencies: [search.value],
      itemsPerPage: ITEMS_PER_PAGE.value,
      shouldRefetchOnFocus: false,
      isInfinity: true,
    })

  function handleSearchInputChange(search: string) {
    setSearch(Text.create(search))
  }

  function handlePictureCardClick(imageName: string) {
    dialogRef.current?.close()
    const image = Image.create(imageName)
    setSelectedImage(image)
    onChange(image)
  }

  function handleLoadMoreButtonClick() {
    nextPage()
  }

  function handleImageSubmit() {
    refetch()
    dialogRef.current?.close()
  }

  function handlePictureCardRemove() {
    refetch()
    dialogRef.current?.close()
  }

  return {
    images: data ? data.map((image) => Image.create(image)) : [],
    selectedImage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    containerRef,
    handleSearchInputChange,
    handlePictureCardClick,
    handlePictureCardRemove,
    handleImageSubmit,
    handleLoadMoreButtonClick,
  }
}
