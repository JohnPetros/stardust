'use client'

import {
  DELEGUA_TOKENS,
  OPERATOR_REGEX,
  STRING_REGEX,
  THEMES,
} from '@/utils/constants'

import createMarker from 'react-content-marker'

const parsers = [
  {
    rule: STRING_REGEX,
    tag: (token: string) => (
      <span style={{ color: THEMES.darkSpace.strings }}>{token}</span>
    ),
  },
  {
    rule: OPERATOR_REGEX,
    tag: (token: string) => (
      <span style={{ color: THEMES.darkSpace.operators }}>{token}</span>
    ),
  },
  {
    rule: new RegExp(`(${DELEGUA_TOKENS.typeKeywords.join('|')})`),
    tag: (token: string) => (
      <span style={{ color: THEMES.darkSpace.typeKeywords }}>{token}</span>
    ),
  },
  {
    rule: new RegExp(`(${DELEGUA_TOKENS.keywords.join('|')})`),
    tag: (token: string) => (
      <span style={{ color: THEMES.darkSpace.keywords }}>{token}</span>
    ),
  },
]

const Marker = createMarker(parsers)

interface CodeTextProps {
  children: string
}

export function CodeText({ children }: CodeTextProps) {
  return (
    <div
      className="space-x-2 tracking-wider"
      style={{ color: THEMES.darkSpace.rest }}
    >
      <Marker>{children}</Marker>
    </div>
  )
}
