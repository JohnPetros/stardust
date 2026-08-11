import * as lessonActions from '@/rpc/next-safe-action/lessonActions'
import { EndingPage } from '@/ui/lesson/widgets/pages/Ending'

export default async function Ending() {
  await lessonActions.accessEndingPage()

  return <EndingPage />
}
