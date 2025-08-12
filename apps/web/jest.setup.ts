import 'jest-canvas-mock'
import '@testing-library/jest-dom'

import { TextEncoder } from 'node:util'

global.TextEncoder = TextEncoder

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

const { defineProperty } = Object

Object.defineProperty = (object, name, meta) => {
  if (meta.get && !meta.configurable) {
    return defineProperty(object, name, {
      ...meta,
      configurable: true,
    })
  }

  return defineProperty(object, name, meta)
}
