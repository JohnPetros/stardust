import {} from 'core'

export const DenoHttp = (): IHttp => {
  return {
    getQueryParams: () => ({
      // Implement logic to extract query parameters from Deno request
    }),

    redirect: (url: string) => {
      // Implement logic to redirect using Deno's response
    },

    getBody: () => {
      // Implement logic to extract request body from Deno request
    },

    setHeader: (key: string, value: string) => {
      // Implement logic to set headers using Deno's response
    },

    send(data?: unknown, statusCode?: number) {
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
        status: statusCode ?? HTTP_STATUS_CODE.ok,
      }) as unknown as ApiResponse
    },
  }
}
