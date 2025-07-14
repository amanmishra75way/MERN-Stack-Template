import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

async function initRedis() {
  if (!redisClient.isOpen) {
    await redisClient
      .connect()
      .then(() => console.log("Redis Connected"))
      .catch(() => console.log("Failed to connect to Redis"));
  }
}

export { redisClient, initRedis };
