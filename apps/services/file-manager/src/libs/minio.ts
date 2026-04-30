import * as Minio from "minio";
import "dotenv/config";

if (
  !process.env.MINIO_ACCESS_KEY ||
  !process.env.MINIO_SECRET_KEY ||
  !process.env.ENV
)
  throw new Error("MINIO_ACCESS_KEY or MINIO_SECRET_KEY is not defined");

export const minioClient = new Minio.Client({
  endPoint: process.env.ENV.toLowerCase() === "dev" ? "localhost" : "minio",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export const MINIO_FILE_BUCKET_NAME = "pdf-files";

export const assertBucket = async (retrires = 5) => {
  while (retrires > 0) {
    try {
      await minioClient.listBuckets();
      const isBucketExsists = await minioClient.bucketExists(
        MINIO_FILE_BUCKET_NAME,
      );
      if (!isBucketExsists) {
        await minioClient.makeBucket(MINIO_FILE_BUCKET_NAME);
      }
      console.log("✅ Minio Connected");
      return;
    } catch (error) {
      retrires--;
      console.error("❌ Minio Connection Failed. Retrying in 5s...");
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  throw new Error("Failed to connect to Minio after multiple attempts");
};
