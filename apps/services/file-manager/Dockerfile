FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

ENV PORT=4000

ENV MONGO_URI=mongodb://root:example@mongo:27017/pdf_compressor?authSource=admin

ENV MINIO_ACCESS_KEY=minio

ENV MINIO_SECRET_KEY=minio1234

ENV RABBITMQ_URL=amqp://rabbitmq:5672

ENV ENV=PROD

EXPOSE 4000

CMD ["node", "dist/main.js"]