# Stage 1: Build the NestJS application
FROM node:20.15 AS builder

WORKDIR /app

COPY package.json package-lock.json ./s
RUN npm install

COPY . .

RUN npm run build
RUN npx prisma generate

# Stage 2: Run the NestJS application
FROM node:20.15-alpine

WORKDIR /app

# Установите зависимости для сборки sharp
RUN apk add --no-cache \
    libc6-compat \
    libjpeg-turbo-dev \
    libpng-dev \
    libtool \
    build-base \
    nasm

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/main"]
