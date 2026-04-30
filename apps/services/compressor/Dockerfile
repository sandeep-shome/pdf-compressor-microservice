FROM python:3.11-slim

RUN apt-get update && apt-get install -y ghostscript && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV RABBITMQ_HOST=rabbitmq

ENV MONGO_URI=mongodb://root:example@mongo:27017/

ENV MINIO_URL=minio:9000

ENV MINIO_ACCESS_KEY=minio

ENV MINIO_SECRET_KEY=minio1234

ENV PYTHONUNBUFFERED=1

CMD ["python", "main.py"]