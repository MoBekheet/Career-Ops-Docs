FROM --platform=linux/amd64 node:22-alpine AS builder

RUN npm install -g pnpm@10 --no-update-notifier

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY lib/ lib/
COPY artifacts/api-server/ artifacts/api-server/

RUN pnpm install --frozen-lockfile

WORKDIR /app/artifacts/api-server
RUN node ./build.mjs

FROM --platform=linux/amd64 node:22-alpine

WORKDIR /app

COPY --from=builder /app/artifacts/api-server/dist ./dist

EXPOSE 8080

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
