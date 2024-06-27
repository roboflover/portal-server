# Stage 1: Build the NestJS application
FROM node:20.1 AS builder

WORKDIR /src

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate
# Stage 2: Run the NestJS application
FROM node:20.1-alpine

WORKDIR /src

COPY --from=builder /src ./

EXPOSE 3000

CMD ["node", "dist/main"]
