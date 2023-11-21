# Install dependencies only when needed
FROM node:20.9-alpine as deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache make gcc g++ libc6-compat bash python3
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN  yarn config set network-timeout 600000 -g
RUN yarn --only=production

FROM node:20.9-alpine as builder

WORKDIR /usr/src/app
COPY . .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json
RUN yarn nx reset
RUN NX_DAEMON=false yarn nx build auth -c production

# Production image, copy all the files and run nest
FROM node:20.9-alpine as runner
RUN apk add --no-cache dumb-init g++ make py3-pip
ENV NODE_ENV production
ENV PORT 3333
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist/apps/auth .
RUN yarn
RUN chown -R node:node .
USER node
EXPOSE 3333
ENV DATABASE__MIGRATIONS_RUN true
CMD dumb-init ./node_modules/.bin/plugins-cli -c "yarn add" "node main.js"
