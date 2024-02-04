import { CodeEditorPlayground } from '@/app/components/CodeEditorPlayground'

type LayoutProps = {
  code: string
}

export function Layout({ code }: LayoutProps) {
  return <CodeEditorPlayground code={code} height={700} isRunnable={true} />
}
