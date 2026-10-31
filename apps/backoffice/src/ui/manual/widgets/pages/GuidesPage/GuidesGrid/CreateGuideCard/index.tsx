import { CreateGuideCardView } from './CreateGuideCardView'
import { useCreateGuideCard } from './useCreateGuideCard'

type Props = {
  onCreate: (title: string) => void
}

export const CreateGuideCard = ({ onCreate }: Props) => {
  const { isFormOpen, setIsFormOpen } = useCreateGuideCard()

  return (
    <CreateGuideCardView
      isFormOpen={isFormOpen}
      onOpenChange={setIsFormOpen}
      onCreate={onCreate}
    />
  )
}
