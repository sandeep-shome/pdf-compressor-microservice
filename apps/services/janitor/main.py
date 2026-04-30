from apscheduler.schedulers.blocking import BlockingScheduler
from minio import Minio
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import time
from datetime import datetime, timedelta

load_dotenv()

MINIO_URL = os.getenv("MINIO_URL")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
MONGO_URI = os.getenv("MONGO_URI")
BUCKET_NAME = "pdf-files"


def connect_minio():
    if(MINIO_URL is None or MINIO_ACCESS_KEY is None or MINIO_SECRET_KEY is None):
        raise Exception("MINIO_URL, MINIO_ACCESS_KEY or MINIO_SECRET_KEY is not defined")
    
    try:
        minio_client = Minio(MINIO_URL, access_key=MINIO_ACCESS_KEY, secret_key=MINIO_SECRET_KEY, secure=False)
        return minio_client
    except Exception as e:
        raise Exception(f"Failed to connect to Minio: {e}")


def connect_mongo():
    if(MONGO_URI is None):
        raise Exception("MONGO_URI is not defined")
    
    retries = 5
    while retries > 0:
        try:
            client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
            client.admin.command('ping') # Force a real connection check
            return client
        except Exception:
            print(f"⌛ Waiting for MongoDB... ({retries} left)")
            retries -= 1
            time.sleep(5)
            
    raise Exception("MongoDB unreachable")
            
def get_connection():
    try:
        minio_client = connect_minio()
        mongo_client = connect_mongo()
        file_collection = mongo_client["pdf_compressor"]["files"]
        return minio_client, file_collection
    except Exception as e:
        print(f"FAILED TO INITIALIZE CONNECTIONS: {e}")
        exit(1)
        

minio_client, file_collection = get_connection()

def cleanup_old_files():
    threshold = datetime.utcnow() - timedelta(hours=24)
    
    try:
        expired_records = file_collection.find({"createdAt": {"$lt": threshold}})
        
        count = 0
        
        for record in expired_records:
            try:
                minio_client.remove_object(BUCKET_NAME, record["objectKey"])
                minio_client.remove_object(BUCKET_NAME, record["compressedObjectKey"])
                
                file_collection.delete_one({"_id": record["_id"]})
                
                print(f"✅ Removed metadata for: {record['_id']}")
                count += 1
            except Exception as e:
                if os.getenv("DEBUG") == "true":
                    print(f"Error deleting file: {e}")
        
        if count > 0:
            print(f"✅ Cleaned up {count} expired files");
    except Exception as e:
        if os.getenv("DEBUG") == "true":
            print(f"Error fetching records: {e}")
            

sched = BlockingScheduler()
sched.add_job(cleanup_old_files, 'interval', hours=1)

cleanup_old_files() # Run once immediately

print("🚀 Janitor service is active and scheduled for every 1 hour.")

try:
    sched.start()
except (KeyboardInterrupt, SystemExit):
    sched.shutdown()