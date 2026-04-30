FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .    

ENV MONGO_URI=mongodb://root:example@mongo:27017/

ENV MINIO_URL=minio:9000

ENV MINIO_ACCESS_KEY=minio

ENV MINIO_SECRET_KEY=minio1234

ENV DEBUG=true

ENV PYTHONUNBUFFERED=1

CMD ["python", "main.py"]