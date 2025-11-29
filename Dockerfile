# ------------------------
# Stage 1: Builder
# ------------------------
FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

# Use hoisted node_modules (no broken symlinks)
RUN pnpm config set node-linker node-modules

# Copy manifests and sources
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig*.json ./
COPY apps ./apps
COPY packages ./packages
COPY prisma ./prisma
COPY scripts ./scripts

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm init:setup

# Build shared and API
RUN pnpm --filter @om/shared build
RUN pnpm --filter api build

# ------------------------
# Stage 2: Production
# ------------------------
FROM node:20-alpine AS prod

WORKDIR /app
RUN npm install -g pnpm
RUN pnpm config set node-linker node-modules

# Copy manifests + source
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages
COPY prisma ./prisma

# Install prod deps
RUN pnpm install --filter api... --prod --frozen-lockfile

# Copy built dist and API node_modules from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

WORKDIR /app/apps/api
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/src/main.js"]
