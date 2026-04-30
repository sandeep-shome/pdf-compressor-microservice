import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import "dotenv/config";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import fileRouter from "./routes/file.js";

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/healthz", (req, res) => {
  res.sendStatus(200);
});

app.use("/api/file", fileRouter);
app.use(
  (err: ErrorJSONResponse, req: Request, res: Response, next: NextFunction) => {
    if (!err) {
      res.status(500).send({
        status: 500,
        name: "Error",
        message: "Internal Server Error",
        stack: new Error().stack!,
        cause: "",
      });
      return;
    }
    res.status(Number(err.status) || 500).json(err);
  },
);

export default app;
