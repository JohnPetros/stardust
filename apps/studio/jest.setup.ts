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

;(global as any).import = {
  meta: {
    env: {
      VITE_STADUST_SERVER_APP_URL: 'http://localhost:3333',
      VITE_CDN_URL: 'https://example.com/cdn',
      VITE_STADUST_WEB_APP_URL: 'http://localhost:3000',
    },
  },
}

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
