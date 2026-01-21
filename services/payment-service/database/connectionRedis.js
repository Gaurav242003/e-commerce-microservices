require("dotenv").config();
const { createClient } = require("redis");

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  password: process.env.REDIS_PASSWORD || undefined
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error", err);
  process.exit(1);
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

const setIdempotencyKey = async (key, value) => {
  await redisClient.set(key, value, { EX: 600 }); // 10 minutes
};

const getIdempotencyKey = async (key) => {
  return redisClient.get(key);
};

const acquireLock = async (key) => {
  return redisClient.set(key, "LOCKED", {
    NX: true,
    EX: 10
  });
};

const releaseLock = async (key) => {
  await redisClient.del(key);
};

module.exports = {
  redisClient,
  connectRedis,
  setIdempotencyKey,
  getIdempotencyKey,
  acquireLock,
  releaseLock
};
