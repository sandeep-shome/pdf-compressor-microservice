import pika
import pymongo
import json
import bson
from minio import Minio
import os
from dotenv import load_dotenv
import time
from lib.gs_compressor import compress_pdf_gs

load_dotenv()

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "")
MONGO_URI = os.getenv("MONGO_URI", "")
MINIO_URL = os.getenv("MINIO_URL", "")
BUCKET_NAME = "pdf-files"
    
def connect_mq():
    retries = 10 # Increased retries for slower dev machines
    while retries > 0:
        try:
            return pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
        except Exception:
            print(f"⌛ Waiting for RabbitMQ... ({retries} left)")
            retries -= 1
            time.sleep(5)
    raise Exception("RabbitMQ unreachable")

def connect_mongo():
    retries = 10
    while retries > 0:
        try:
            client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            client.admin.command('ping') # Force a real connection check
            return client
        except Exception:
            print(f"⌛ Waiting for MongoDB... ({retries} left)")
            retries -= 1
            time.sleep(5)
    raise Exception("MongoDB unreachable")

def get_connection():
    try:
        # rabbitmq config
        mq_conn = connect_mq()
        channel = mq_conn.channel()
        channel.queue_declare(queue='file-queue', durable=True, arguments={'x-queue-type': 'quorum'})
        channel.basic_qos(prefetch_count=1)
        
        # mongodb config
        client = connect_mongo()
        db = client["pdf_compressor"]
        collection = db["files"]
        
        # minio config
        minio_client = Minio(MINIO_URL, access_key=os.getenv("MINIO_ACCESS_KEY"), secret_key=os.getenv("MINIO_SECRET_KEY"), secure=False)
        if not minio_client.bucket_exists(BUCKET_NAME):
            minio_client.make_bucket(BUCKET_NAME)
        
        print("✅ Successfully initialized connections - Compressor")

        return channel, collection, minio_client
        
    except Exception as e:
        print(f"FAILED TO INITIALIZE CONNECTIONS: {e}")
        exit(1)


channel, collection, minio_client = get_connection()

def callback(ch, method, properties, body):
    local_input = None
    local_output = None
    
    try:
        print(f" [x] Processing task: {body.decode()}")
        data = json.loads(body)
        doc_id = bson.ObjectId(data["id"])
        
        
        # Update status to PROCESSING
        file_data = collection.find_one_and_update(
            filter={"_id": doc_id}, 
            update={"$set": {"status": "PROCESSING"}}, 
            return_document=pymongo.ReturnDocument.AFTER
        )

        if not file_data:
            print(f"!! Error: Document {doc_id} disappeared from DB")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return
        
        # Prepare paths
        filename = file_data["objectKey"]
        local_input = os.path.join(os.getcwd(), f"in-{filename}")
        local_output = os.path.join(os.getcwd(), f"compressed-{filename}")
        
        # 2. DOWNLOAD
        minio_client.fget_object(BUCKET_NAME, filename, local_input)
                
        # 3. COMPRESS
        compress_pdf_gs(local_input, local_output, file_data["power"])
        compressed_filename = os.path.basename(local_output)
        
        if not os.path.exists(local_output):
            print(f"!! Error: Compressed file {compressed_filename} does not exist")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return
        
        # 4. UPLOAD
        minio_client.fput_object(BUCKET_NAME, compressed_filename, local_output)
        
        # Update status to COMPLETED
        collection.find_one_and_update(
            filter={"_id": doc_id}, 
            update={"$set": {"status": "COMPLETED", "compressedObjectKey": compressed_filename, "compressedSize": os.path.getsize(local_output)}}, 
        )
        
        ch.basic_ack(delivery_tag=method.delivery_tag)
        
    except Exception as e:
        print(f"Error processing message: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag)
    finally:
        if os.path.exists(str(local_input)):
            os.remove(str(local_input))
        if os.path.exists(str(local_output)):
            os.remove(str(local_output))
    

channel.basic_consume(queue='file-queue', on_message_callback=callback, auto_ack=False)

print('[*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()