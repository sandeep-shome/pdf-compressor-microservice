import amqp, { type Channel, type ChannelModel } from "amqplib";
import "dotenv/config";

export class RabbitMQClient {
  public connection: ChannelModel | null = null;
  public channel: Channel | null = null;

  private readonly url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

  async connect(retries = 5): Promise<void> {
    while (retries > 0) {
      try {
        console.log(`Connecting to RabbitMQ (Attempts left: ${retries})...`);
        this.connection = await amqp.connect(this.url);
        this.channel = await this.connection.createChannel();

        await this.channel.assertQueue("file-queue", {
          durable: true,
          arguments: {
            "x-queue-type": "quorum", // Quorum is great for production data safety
          },
        });

        console.log("✅ RabbitMQ Connected and Queue Asserted");
        return; // Success! Exit the loop.
      } catch (error) {
        retries -= 1;
        console.error("❌ RabbitMQ Connection Failed. Retrying in 5s...");
        await new Promise((res) => setTimeout(res, 5000)); // Wait before retry
      }
    }
    throw new Error("Failed to connect to RabbitMQ after multiple attempts");
  }
}
