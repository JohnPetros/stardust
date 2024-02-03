import { ContentDialog } from '../../components/Layout/ContentDialog'
import { Result } from '../components/Result'

export default function CommentsSlot() {
  return (
    <>
      <div className="md:hidden">
        <ContentDialog>
          <Result />
        </ContentDialog>
      </div>
      <div className="hidden h-full md:block">
        <Result />
      </div>
    </>
  )
}
