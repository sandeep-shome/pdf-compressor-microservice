import type { Document } from "mongoose";

type FileStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

interface IFileSchema extends Document {
  name: string;
  objectKey: string;
  compressedObjectKey: string;
  originalSize: number;
  status: FileStatus;
  power: number;
  compressedSize: number;
}
