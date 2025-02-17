FROM node:22.14.0-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./

FROM base AS executor
RUN yarn install --frozen-lockfile --production
COPY . .
CMD ["node", "index.mjs"]
