import { ServerType } from '@hono/node-server'
import type { Hono } from 'hono'

type Request = {
  body?: any
  headers?: Record<string, string>
}

export class HonoServer {
  routePrefix = ''

  constructor(
    private readonly hono: Hono,
    private readonly server: ServerType,
  ) {}

  setRoutePrefix(routePrefix: string) {
    this.routePrefix = routePrefix
  }

  close() {
    this.server.close()
  }

  post(route: string, request: Request) {
    return this.hono.request(`${this.routePrefix}${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...request.headers,
      },
      body: JSON.stringify(request.body),
    })
  }

  get(route: string, request: Request) {
    return this.hono.request(`${this.routePrefix}${route}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...request.headers,
      },
    })
  }

  put(route: string, request: Request) {
    return this.hono.request(`${this.routePrefix}${route}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...request.headers,
      },
      body: JSON.stringify(request.body),
    })
  }

  patch(route: string, request: Request) {
    return this.hono.request(`${this.routePrefix}${route}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...request.headers,
      },
      body: JSON.stringify(request.body),
    })
  }

  delete(route: string, request: Request) {
    return this.hono.request(`${this.routePrefix}${route}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...request.headers,
      },
    })
  }
}
