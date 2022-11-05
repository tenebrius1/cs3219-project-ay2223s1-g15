import UserModel from "./user-model.js";
import "dotenv/config";
import redis from "redis";

// Set up mongoose connection
import mongoose from "mongoose";

const mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

// Connect to MongoDB
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("connected", () => console.log("connected to MongoDB"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Connect to Redis
const redisClient = redis.createClient({
  url: `redis://default:${process.env.REDIS_PW}@redis-14796.c285.us-west-2-2.ec2.cloud.redislabs.com:14796`,
});

redisClient.on("connect", () => console.log("connected to Redis"));
redisClient.on("error", console.error);
await redisClient.connect();

// Functions that interact with MongoDB (user data)
export const createUser = async (params) => new UserModel(params);

export const exists = async (email, userID) => await UserModel.exists({ $or: [{ username: userID }, { email }] });

export const findUser = async (userID) => await UserModel.findOne({ username: userID });

export const deleteUser = async (userID) => await UserModel.findOneAndDelete({ username: userID });

export const changePassword = async (userID, newPassword) => await UserModel.findOneAndUpdate(
  { username: userID },
  { password: newPassword },
);

// Functions that interact with Redis (JWT token blacklist)
export const isBlacklisted = async (token) => {
  const inBlacklist = await redisClient.get(`bl_${token}`);
  return inBlacklist;
};

export const blacklist = async (token) => {
  const token_key = `bl_${token}`;
  return await redisClient.set(token_key, token);
};
