# Stage 1: Build the NestJS application
FROM node:21.0 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npx prisma generate

# Stage 2: Run the NestJS application
FROM node:21.0-bullseye-slim

WORKDIR /app

# Установите зависимости для сборки sharp
RUN apt-get update && apt-get install -y \
    libc6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libtool \
    build-essential \
    nasm \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/main"]
