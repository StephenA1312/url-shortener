FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV BASE_URL=https://url.stephen-ali.com

RUN npm run build

# Flatten standalone output — server.js may be nested under a subdir
RUN if [ -f .next/standalone/server.js ]; then \
      echo "standalone at root"; \
    else \
      mv .next/standalone/*/server.js .next/standalone/ 2>/dev/null; \
      cp -r .next/standalone/*/node_modules .next/standalone/ 2>/dev/null; \
      cp -r .next/standalone/*/.next .next/standalone/ 2>/dev/null; \
      rm -rf .next/standalone/*/; \
    fi

# Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/url-shortener.db
ENV BASE_URL=https://url.stephen-ali.com

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Create writable data directory for SQLite
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
