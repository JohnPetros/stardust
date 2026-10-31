export const MAX_DECODED_CHARACTERS = 200_000

const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/

type FileObject = { encoding?: unknown; content?: unknown } & Record<string, unknown>

type FileResult = {
  successful?: unknown
  data?: FileObject
} & Record<string, unknown>

function isFileObject(value: unknown): value is FileObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function truncateContent(content: string): string {
  if (content.length <= MAX_DECODED_CHARACTERS) return content

  const lastCode = content.charCodeAt(MAX_DECODED_CHARACTERS - 1)
  const end =
    lastCode >= 0xd800 && lastCode <= 0xdbff
      ? MAX_DECODED_CHARACTERS - 1
      : MAX_DECODED_CHARACTERS

  return `${content.slice(0, end)}\n[conteúdo truncado: ${content.length - end} caracteres omitidos]`
}

export function decodeBase64FileContent(result: unknown): unknown {
  const candidate = result as FileResult | null

  if (candidate?.successful !== true) return result

  const data = candidate.data
  const file = isFileObject(data?.content) ? data.content : data

  if (file?.encoding !== 'base64' || typeof file.content !== 'string') {
    return result
  }

  const normalized = file.content.replace(/\s+/g, '')

  if (normalized.length % 4 !== 0 || !BASE64_PATTERN.test(normalized)) return result

  try {
    const content = new TextDecoder('utf-8', { fatal: true }).decode(
      Buffer.from(normalized, 'base64'),
    )

    return {
      ...candidate,
      data: { ...file, content: truncateContent(content), encoding: 'utf-8' },
    }
  } catch {
    return file.content.length > MAX_DECODED_CHARACTERS
      ? {
          ...candidate,
          data: {
            ...file,
            content: `[arquivo binário omitido: ${file.content.length} caracteres]`,
          },
        }
      : result
  }
}
