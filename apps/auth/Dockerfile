# Install dependencies only when needed
FROM docker.io/node:lts-alpine as deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN  yarn config set network-timeout 600000 -g
RUN yarn --only=production

FROM docker.io/node:lts-alpine as builder

WORKDIR /usr/src/app
COPY . .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json
RUN yarn nx reset
RUN NX_DAEMON=false yarn nx build auth -c production

# Production image, copy all the files and run nest
FROM docker.io/node:16.16-alpine as runner
RUN apk add --no-cache dumb-init
ENV NODE_ENV production
ENV PORT 3333
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/dist/apps/auth .
RUN chown -R node:node .
USER node
EXPOSE 3333
ENV DATABASE__MIGRATIONS_RUN true
CMD dumb-init ./node_modules/.bin/plugins-cli "node main.js"
