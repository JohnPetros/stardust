import { EmptyNotesStateView } from './EmptyNotesStateView'

type Props = {
  title: string
  description: string
}

export const EmptyNotesState = ({ title, description }: Props) => {
  return <EmptyNotesStateView title={title} description={description} />
}
