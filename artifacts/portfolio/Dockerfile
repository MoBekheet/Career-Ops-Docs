FROM --platform=linux/amd64 node:22-slim AS builder

RUN npm install -g pnpm@10 --no-update-notifier

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json tsconfig.base.json ./
COPY lib/ lib/
COPY artifacts/portfolio/ artifacts/portfolio/
COPY attached_assets/ attached_assets/

RUN pnpm install --frozen-lockfile

WORKDIR /app/artifacts/portfolio

ARG PORT=80
ARG BASE_PATH=/
ENV PORT=${PORT}
ENV BASE_PATH=${BASE_PATH}

RUN pnpm run build

FROM --platform=linux/amd64 nginx:1.27-alpine

COPY artifacts/portfolio/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/artifacts/portfolio/dist/public /usr/share/nginx/html

EXPOSE 3000
