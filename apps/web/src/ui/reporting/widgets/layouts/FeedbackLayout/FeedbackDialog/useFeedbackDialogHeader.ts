import type { IconName } from '@/ui/global/widgets/components/Icon/types'

export type FeedbackDialogHeaderMetadata = {
  label: string
  icon: IconName
  color: string
}

const metadataByIntent: Record<string, FeedbackDialogHeaderMetadata> = {
  bug: { label: 'Problema', icon: 'bug', color: 'text-green-500' },
  idea: { label: 'Ideia', icon: 'lightbulb', color: 'text-yellow-400' },
  other: { label: 'Outro', icon: 'comment', color: 'text-blue-400' },
}

export function useFeedbackDialogHeader({ intent }: { intent: string }) {
  return {
    currentIntent: metadataByIntent[intent] ?? metadataByIntent.other,
  }
}
