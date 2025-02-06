FROM node:22.12.0-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./

FROM base AS executor
RUN yarn install --frozen-lockfile
COPY . .
CMD ["yarn", "start"]
