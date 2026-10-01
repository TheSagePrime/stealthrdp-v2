# StealthRDP V2 preview image.
FROM node:24-bookworm-slim AS dependencies

ENV COREPACK_HOME=/corepack
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.34.5 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:24-bookworm-slim AS builder

ENV COREPACK_HOME=/corepack \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    CI=true \
    SEO_AUDIT_LOCAL=true \
    SEO_AUDIT_SITE_URL=https://seo-audit.invalid \
    DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/stealthrdp_v2 \
    SITE_URL=https://preview.antah.de \
    APP_ENV=preview

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.34.5 --activate
COPY --from=dependencies /corepack /corepack
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN pnpm build

FROM node:24-bookworm-slim AS runner

ENV NODE_ENV=production \
    PORT=8080 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/stealthrdp_v2

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 8080
CMD ["node", "node_modules/next/dist/bin/next", "start"]
