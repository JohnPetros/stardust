require('dotenv').config({ path: '.env.local' })

import { TextEncoder } from 'util'
global.TextEncoder = TextEncoder

import 'jest-canvas-mock'
import '@testing-library/jest-dom'

const { defineProperty } = Object

Object.defineProperty = function (object, name, meta) {
  if (meta.get && !meta.configurable) {
    return defineProperty(object, name, {
      ...meta,
      configurable: true,
    })
  }

  return defineProperty(object, name, meta)
}
