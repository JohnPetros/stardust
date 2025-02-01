FROM node:20.15.1-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /stardust
RUN npm install -g turbo
COPY . .
RUN ls ./apps/web -la
RUN turbo prune --scope=@stardust/web --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /stardust
COPY .gitignore .gitignore
COPY --from=builder /stardust/out/json/ .
RUN npm install
COPY --from=builder /stardust/out/full/ .
COPY turbo.json turbo.json
RUN ls ./apps/web -la
RUN npx turbo run build --filter=@stardust/web

FROM base AS runner
WORKDIR /stardust
RUN addgroup --system --gid 1001 stardust
RUN adduser --system --uid 1001 web
USER web
COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .
COPY --from=installer --chown=stardust:web /stardust/apps/web/.next/standalone ./
COPY --from=installer --chown=stardust:web /stardust/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=stardust:web /stardust/apps/web/public ./apps/web/public

CMD node apps/web/server.js
