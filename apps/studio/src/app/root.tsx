import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import type { Route } from './+types/root'

import '@/ui/global/styles/global.css'
import { Toaster } from 'sonner'
import { AuthContextProvider } from '@/ui/auth/contexts/AuthContext'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  {
    rel: 'icon',
    type: 'image/png',
    href: 'https://aukqejqsiqsqowafpppb.supabase.co/storage/v1/object/public/images/marketing/favicon.png',
  },
]

const queryClient = new QueryClient()

export const Root = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='pt-BR'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  )
}

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}

export const App = () => {
  return (
    <div className='w-full h-screen dark'>
      <QueryClientProvider client={queryClient}>
        <Toaster position='top-right' richColors />
        <AuthContextProvider>
          <Outlet />
        </AuthContextProvider>
      </QueryClientProvider>
    </div>
  )
}

export default App
