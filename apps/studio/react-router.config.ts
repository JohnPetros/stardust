import type { Config } from '@react-router/dev/config'

export default {
  ssr: false,
  appDirectory: 'src/app',
  future: {
    v8_middleware: true,
  },
} satisfies Config
