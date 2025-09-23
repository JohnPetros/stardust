import MonacoEditor, { type Monaco } from '@monaco-editor/react'
import type monaco from 'monaco-editor'

import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useEditorContext } from '@/ui/global/hooks/useEditorContext'
import { LANGUAGE } from './language'
import type { CodeEditorTheme } from './types'
import { Loading } from '../Loading'

type CodeEditorProps = {
  value: string
  theme?: CodeEditorTheme
  width: number | string
  height: number | string
  isReadOnly?: boolean
  isMobile: boolean
  tabSize: number
  fontSize: number
  onMount: (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => void
  onChange?: (value: string | undefined) => void
}

export const CodeEditorView = ({
  value,
  width,
  height,
  theme = 'dark-space',
  isReadOnly = false,
  isMobile,
  tabSize,
  fontSize,
  onMount = () => {},
  onChange = () => {},
}: CodeEditorProps) => {
  return (
    <MonacoEditor
      width={width}
      height={height}
      language={LANGUAGE}
      theme={theme}
      options={{
        minimap: {
          enabled: false,
        },
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        tabSize: tabSize,
        fontSize: fontSize - (isMobile ? 2 : 0),
        fontFamily: 'Menlo',
        cursorStyle: 'line',
        wordWrap: 'off',
        autoIndent: 'full',
        readOnly: isReadOnly,
        domReadOnly: true,
      }}
      loading={
        <div className='grid place-content-center'>
          <Loading />
        </div>
      }
      value={value}
      onMount={onMount}
      onChange={onChange}
    />
  )
}
