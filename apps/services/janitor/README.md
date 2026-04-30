# Janitor Service

Janitor worker for the PDF Compression App.

## Features

- Delete old compressed files

- Delete old metadata

## Technologies

- Python

## Run Locally

Create and activate a virtual environment

```bash
python -m venv .venv

source .venv/Scripts/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Start the worker

```bash
python main.py
```

## Build

```bash
npm run build
```

## Environment Variables

- `DEBUG` - Set to `true` to enable debug mode

- `MONGO_URI` - MongoDB connection string

- `MINIO_URL` - Minio server URL

- `MINIO_ACCESS_KEY` - your_access_key

- `MINIO_SECRET_KEY` - your_secret_key
