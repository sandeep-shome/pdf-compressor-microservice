# File Manager Service

File manager for the PDF Compression App.

## Features

- Upload and download PDF files

- Get file metadata

- Get file status

## Technologies

- Node.js

- Express

- SSE (Server-Sent Events)

- Multer

- TypeScript

## Run Locally

Install dependencies

```bash
pnpm install
```

Start the server

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

- `RABBITMQ_HOST` - Host name of the RabbitMQ server

- `MONGO_URI` - MongoDB connection string

- `MINIO_URL` - Minio server URL

- `MINIO_ACCESS_KEY` - your_access_key

- `MINIO_SECRET_KEY` - your_secret_key

- `PORT` - Port number, defaults to 4000

- `ENV` - Environment, defaults to "dev"
