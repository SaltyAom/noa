FROM debian:11.5-slim as builder

WORKDIR /app

RUN apt update
RUN apt install curl unzip -y

RUN curl https://bun.sh/install | bash -s -- bun-v0.2.2

COPY package.json .
COPY bun.lockb .

RUN /root/.bun/bin/bun install --production

# ? -------------------------
FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=builder /root/.bun/bin/bun bun
COPY --from=builder /app/node_modules node_modules

COPY src src
COPY public public

ENV ENV production
CMD ["./bun", "src/index.ts"]
