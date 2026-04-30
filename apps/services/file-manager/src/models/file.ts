import mongoose, { Schema, Model, model } from "mongoose";
import type { IFileSchema } from "../types/model.js";

const fileSchema = new Schema<IFileSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    objectKey: {
      type: String,
      required: true,
    },
    compressedObjectKey: {
      type: String,
      default: null,
    },
    originalSize: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    power: {
      type: Number,
      required: true,
      enum: [0, 1, 2, 3],
    },
    compressedSize: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const File =
  (mongoose.models.File as Model<IFileSchema>) ||
  model<IFileSchema>("File", fileSchema);
