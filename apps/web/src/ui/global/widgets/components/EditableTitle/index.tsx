import { useEditableTitle } from './useEditableTitle'
import { EditableTitleView } from './EditableTitleView'

type Props = {
  initialTitle: string
  onEditTitle: (title: string) => Promise<void>
}

export const EditableTitle = ({ initialTitle, onEditTitle }: Props) => {
  const { title, inputRef, canEditTitle, handleTitleChange, handleButtonClick } =
    useEditableTitle(initialTitle, onEditTitle)

  return (
    <EditableTitleView
      title={title}
      canEditTitle={canEditTitle}
      inputRef={inputRef}
      onTitleChange={handleTitleChange}
      onButtonClick={handleButtonClick}
      onEditTitle={onEditTitle}
    />
  )
}
