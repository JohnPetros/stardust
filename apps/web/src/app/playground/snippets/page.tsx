import { playgroundActions } from '@/rpc/next-safe-action'
import { SnippetsPage } from '@/ui/playground/widgets/pages/Snippets'

const Page = async () => {
  await playgroundActions.accessSnippetsPage()

  return <SnippetsPage />
}

export default Page
