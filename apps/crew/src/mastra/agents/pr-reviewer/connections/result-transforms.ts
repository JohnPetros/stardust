import type { ToolResultTransform } from '@/composio/with-result-transform'
import { decodeBase64FileContent } from '@/utils/decode-base64-file-content'

export const PR_REVIEWER_RESULT_TRANSFORMS: Record<string, ToolResultTransform> = {
  GITHUB_GET_REPOSITORY_CONTENT: decodeBase64FileContent,
}
