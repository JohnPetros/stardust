import { BlockPreviewView } from './BlockPreviewView'

type Props = {
  preview: string
  picture?: string
}

export const BlockPreview = ({ preview, picture }: Props) => {
  return <BlockPreviewView preview={preview} picture={picture} />
}
