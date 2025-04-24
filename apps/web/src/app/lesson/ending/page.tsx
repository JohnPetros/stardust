import { lessonActions } from '@/rpc/next-safe-action'
import { EndingPage } from '@/ui/lesson/widgets/pages/Ending'

export default async function Ending() {
  await lessonActions.accessEndingPage()

  return <EndingPage />
}
