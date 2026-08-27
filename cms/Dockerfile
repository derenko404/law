FROM node:22.17.0-alpine AS base

# ---- Dependencies ----
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
# .npmrc matters: legacy-peer-deps must match local resolution or npm ci rejects the lockfile
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# ---- Build ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Run ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder /app ./
# Upload dir; in production a persistent volume is mounted at /app/media
RUN mkdir -p media

EXPOSE 3000

# Apply pending DB migrations, then serve
CMD ["sh", "-c", "npm run migrate && npm run start"]
