import type { Config } from '@react-router/dev/config'

export default {
  ssr: false,
  appDirectory: 'src/app',
  future: {
    unstable_middleware: true,
  },
} satisfies Config
