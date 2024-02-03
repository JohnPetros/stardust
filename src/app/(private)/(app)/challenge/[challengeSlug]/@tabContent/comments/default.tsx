import { ContentDialog } from '../../components/Layout/ContentDialog'
import { CommentsList } from '../components/CommentsList'

export default function CommentsSlot() {
  return (
    <>
      <div className="md:hidden">
        <ContentDialog contentType="comments">
          <CommentsList />
        </ContentDialog>
      </div>
      <div className="hidden md:block">
        <CommentsList />
      </div>
    </>
  )
}
