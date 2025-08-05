import MonacoEditor, { type Monaco } from '@monaco-editor/react'
import type monaco from 'monaco-editor'

import { LANGUAGE } from './language'
import type { CodeEditorTheme } from './types'
import { Loading } from '../Loading'

type CodeEditorProps = {
  value: string
  theme?: CodeEditorTheme
  width: number | string
  height: number | string
  isReadOnly?: boolean
  onMount: (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => void
  onChange?: (value: string | undefined) => void
}

export const CodeEditorView = ({
  value,
  width,
  height,
  theme = 'dark-space',
  isReadOnly = false,
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
        tabSize: 2,
        fontSize: 14,
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
