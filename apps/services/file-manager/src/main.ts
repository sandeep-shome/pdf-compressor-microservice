import server from "http";
import app from "./app.js";
import "dotenv/config";
import { assertBucket } from "./libs/minio.js";
import { dbConn } from "./libs/db.js";
import { RabbitMQClient } from "./libs/rabbit.js";

const port = process.env.PORT || 3000;
export const mqClient = new RabbitMQClient();

const startServer = async () => {
  try {
    await assertBucket();

    await dbConn();
    await mqClient.connect();

    server.createServer(app).listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message);
    else throw new Error("Something went wrong");
    process.exit(1);
  }
};

startServer()
  .then(() => console.log("File service is running..."))
  .catch((err) => console.log(err));
