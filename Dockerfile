FROM node:22.12.0-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./

FROM base AS development
RUN yarn install --frozen-lockfile
CMD ["yarn", "start:dev"]

FROM base AS builder
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM base AS prod-deps
RUN yarn install --frozen-lockfile --production

FROM base AS production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/migrations ./migrations
EXPOSE 8080
USER node
CMD ["node", "dist/main.js"]
