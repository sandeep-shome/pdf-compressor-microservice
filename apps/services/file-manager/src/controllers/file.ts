import type { Request, Response, NextFunction } from "express";
import { ErrorBuilder } from "../libs/utils.js";
import { MINIO_FILE_BUCKET_NAME, minioClient } from "../libs/minio.js";
import { File } from "../models/file.js";
import { mqClient } from "../main.js";
import type { FileStatus } from "../types/model.js";

export async function uploadController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const file = req.file;

    if (!file || !file.buffer) {
      res.status(400).send("No file uploaded.");
      return;
    }

    const destinationObject = `${Date.now()}-${file?.originalname}`;
    const metaData = {
      "Content-Type": file?.mimetype,
      "x-amz-meta-title": file?.originalname,
    };

    await minioClient.putObject(
      MINIO_FILE_BUCKET_NAME,
      destinationObject,
      file.buffer,
      file.size,
      metaData,
    );

    const fileData = new File({
      name: file.originalname,
      objectKey: destinationObject,
      compressedObjectKey: null,
      status: "PENDING" as FileStatus,
      originalSize: file.size,
      power: parseInt(req.body.power),
      compressedSize: 0,
    });

    const fileSavedData = await fileData.save();

    mqClient.channel!.sendToQueue(
      "file-queue",
      Buffer.from(
        JSON.stringify({
          id: fileSavedData._id,
        }),
      ),
    );

    res.status(200).json({
      status: 200,
      name: "Success",
      message: "File uploaded successfully",
      data: {
        jobId: fileSavedData._id,
      },
    });
  } catch (err) {
    if (res.headersSent) return next(err);

    const status =
      err instanceof Error && (err as any).status ? (err as any).status : 500;
    const errorBody = new ErrorBuilder(
      status,
      err instanceof Error ? err.name : "InternalError",
      err instanceof Error ? err.message : "An unexpected error occurred",
    ).buildErrorJSON();

    next(errorBody);
  }
}

export async function statusController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "cache-control": "no-cache",
      connection: "keep-alive",
    });

    // Send an initial heartbeats
    res.write("retry: 3000\n\n");

    const interval = setInterval(async () => {
      try {
        const fileData = await File.findById(req.params.id);

        if (!fileData) {
          res.write(`data: ${JSON.stringify({ error: "File not found" })}\n\n`);
          clearInterval(interval);
          res.end();
          return;
        }

        const payload = JSON.stringify({
          status: fileData.status,
        });

        res.write(`data: ${payload}\n\n`);

        // 3. Close stream if terminal state is reached
        if (fileData.status === "COMPLETED" || fileData.status === "FAILED") {
          clearInterval(interval);
          res.end();
        }
      } catch (pollError) {
        console.error("Polling error:", pollError);
        clearInterval(interval);
        res.end();
      }
    }, 1000);

    res.on("close", () => {
      clearInterval(interval);
      res.end();
    });
  } catch (err) {
    if (res.headersSent) return next(err);

    const status =
      err instanceof Error && (err as any).status ? (err as any).status : 500;
    const errorBody = new ErrorBuilder(
      status,
      err instanceof Error ? err.name : "InternalError",
      err instanceof Error ? err.message : "An unexpected error occurred",
    ).buildErrorJSON();
    next(errorBody);
  }
}

export async function getFileMetaDataController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const fileDataObtainedById = await File.findById(req.params.id);

    if (!fileDataObtainedById) {
      next(
        new ErrorBuilder(
          404,
          "NotFoundError",
          "File not found",
        ).buildErrorJSON(),
      );
      return;
    }

    const data = {
      name: fileDataObtainedById.name,
      originalSize: fileDataObtainedById.originalSize,
      status: fileDataObtainedById.status,
      compressedSize: fileDataObtainedById.compressedSize,
    };

    res.status(200).json({
      status: 200,
      name: "Success",
      message: "File metadata fetched successfully",
      data,
    });
  } catch (err) {
    if (res.headersSent) return next(err);

    const status =
      err instanceof Error && (err as any).status ? (err as any).status : 500;
    const errorBody = new ErrorBuilder(
      status,
      err instanceof Error ? err.name : "InternalError",
      err instanceof Error ? err.message : "An unexpected error occurred",
    ).buildErrorJSON();
    next(errorBody);
  }
}

export async function downloadController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const fileData = await File.findById(req.params.id);

    if (!fileData) {
      next(
        new ErrorBuilder(
          404,
          "NotFoundError",
          "File not found",
        ).buildErrorJSON(),
      );
      return;
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="compressed-${fileData.name}"`,
    );

    const dataStream = await minioClient.getObject(
      MINIO_FILE_BUCKET_NAME,
      fileData.objectKey!,
    );

    dataStream.on("error", (err) => {
      console.log("Minio Stram Error:", err);
      res.status(500).end();
    });

    dataStream.pipe(res);
  } catch (err) {
    if (res.headersSent) return next(err);

    const status =
      err instanceof Error && (err as any).status ? (err as any).status : 500;
    const errorBody = new ErrorBuilder(
      status,
      err instanceof Error ? err.name : "InternalError",
      err instanceof Error ? err.message : "An unexpected error occurred",
    ).buildErrorJSON();

    next(errorBody);
  }
}
