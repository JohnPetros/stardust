import type { Text } from '@/@types/text'

export interface IMdxController {
  compileMdxComponents(components: string[]): Promise<string[]>
  compileDescription: (description: string) => Promise<string>
  parseTexts(texts: Text[]): Promise<string[]>
}
