# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
ENV PNPM_HOME=/pnpm
ENV PATH=/pnpm:$PATH
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app
# Flatten node_modules (npm-like) so transitive top-level imports (e.g. dotenv in prisma.config.ts) resolve,
# and ignore the vestigial pnpm-workspace.yaml that lacks a `packages` field.
RUN printf "node-linker=hoisted\nshamefully-hoist=true\n" > /app/.npmrc

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-workspace --no-frozen-lockfile
COPY . .
# Drop the vestigial pnpm-workspace.yaml (no `packages` field) so every pnpm invocation stops erroring.
RUN rm -f pnpm-workspace.yaml
RUN pnpm prisma generate
RUN pnpm build

FROM base AS prod
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/generated ./generated
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
EXPOSE 3001
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/main"]
