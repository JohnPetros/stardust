declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_CDN_URL: string
      NEXT_APP_BASE_URL: string
    }
  }
}
