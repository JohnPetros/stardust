import { renderHook } from '@testing-library/react'

import { TextBlock } from '@stardust/core/global/structures'
import { TextBlocksFaker } from '@stardust/core/lesson/entities/fakers'

import { useMdx } from '../useMdx'

describe('useMdx', () => {
  const Hook = () => renderHook(() => useMdx())

  it('should serialize audio props for eligible blocks with stored audio files', () => {
    const fileName = 'intro.wav'
    const textBlock = TextBlock.create({
      ...TextBlocksFaker.fakeDto({ type: 'default' }),
      audio: { fileName, status: 'done', voice: 'panda' },
    })

    const { result } = Hook()
    const [mdx] = result.current.parseTextBlocksToMdx([textBlock], { [fileName]: true })

    expect(mdx).toContain(`audioFileName={'${fileName}'}`)
    expect(mdx).toContain("audioStatus={'done'}")
  })

  it('should serialize audio props for image blocks when the file exists', () => {
    const fileName = 'image.wav'
    const imageBlock = TextBlock.create({
      ...TextBlocksFaker.fakeDto({ type: 'image' }),
      audio: { fileName, status: 'done', voice: 'robot' },
    })

    const { result } = Hook()
    const [mdx] = result.current.parseTextBlocksToMdx([imageBlock], { [fileName]: true })

    expect(mdx).toContain('<Image')
    expect(mdx).toContain(`audioFileName={'${fileName}'}`)
    expect(mdx).toContain("audioStatus={'done'}")
  })

  it('should not serialize audio props for non eligible blocks', () => {
    const fileName = 'user.wav'
    const textBlock = TextBlock.create({
      ...TextBlocksFaker.fakeDto({ type: 'user' }),
      audio: { fileName, status: 'done', voice: 'alien' },
    })

    const { result } = Hook()
    const [mdx] = result.current.parseTextBlocksToMdx([textBlock], { [fileName]: true })

    expect(mdx).not.toContain('audioFileName=')
    expect(mdx).not.toContain('audioStatus=')
  })

  it('should not serialize audio props when the file is not available in storage', () => {
    const fileName = 'missing.wav'
    const textBlock = TextBlock.create({
      ...TextBlocksFaker.fakeDto({ type: 'quote' }),
      audio: { fileName, status: 'done', voice: 'shark' },
    })

    const { result } = Hook()
    const [mdx] = result.current.parseTextBlocksToMdx([textBlock], { [fileName]: false })

    expect(mdx).not.toContain('audioFileName=')
    expect(mdx).not.toContain('audioStatus=')
  })
})
