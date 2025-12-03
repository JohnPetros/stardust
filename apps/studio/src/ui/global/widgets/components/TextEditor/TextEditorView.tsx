import MonacoEditor from '@monaco-editor/react'
import type Monaco from 'monaco-editor'

import { Loading } from '../Loading'

type Props = {
  value: string
  width: number | string
  height: number | string
  onChange?: (value: string | undefined) => void
  onMount: (editor: Monaco.editor.IStandaloneCodeEditor) => void
}

export const TextEditorView = ({
  value,
  width,
  height,
  onChange = () => {},
  onMount = () => {},
}: Props) => {
  return (
    <MonacoEditor
      width={width}
      height={height}
      language='mdx'
      theme='vs-dark'
      options={{
        minimap: {
          enabled: false,
        },
        lineNumbers: 'off',
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        tabSize: 2,
        fontSize: 14,
        fontFamily: 'Menlo',
        cursorStyle: 'line',
        wordWrap: 'on',
        autoIndent: 'full',
        domReadOnly: true,
        renderLineHighlight: 'none',
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        padding: {
          top: 16,
        },
      }}
      loading={
        <div className='grid place-content-center'>
          <Loading />
        </div>
      }
      value={value}
      onChange={onChange}
      onMount={onMount}
    />
  )
}
