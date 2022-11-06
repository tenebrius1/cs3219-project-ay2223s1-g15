import UserModel from './user-model.js';
import 'dotenv/config';
import redis from 'redis';
import cloudinary from 'cloudinary';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB =
  process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

// Connect to MongoDB
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('connected', () => console.log('connected to MongoDB'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Connect to Redis
const redisClient = redis.createClient({
  url: `redis://default:${process.env.REDIS_PW}@redis-14796.c285.us-west-2-2.ec2.cloud.redislabs.com:14796`,
});

redisClient.on('connect', () => console.log('connected to Redis'));
redisClient.on('error', console.error);
await redisClient.connect();

cloudinary.v2.config({
  cloud_name: 'dkbsbikj8',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Functions that interact with MongoDB (user data)
export const createUser = async (params) => {
  return new UserModel(params);
};

export const exists = async (email, userID) => {
  return await UserModel.exists({ $or: [{ username: userID }, { email: email }] });
};

export const findUser = async (userID) => {
  return await UserModel.findOne({ username: userID });
};

export const findUserByEmail = async (email) => {
  return await UserModel.findOne({ email: email });
};

export const deleteUser = async (userID) => {
  return await UserModel.findOneAndDelete({ username: userID });
};

export const changePassword = async (userID, newPassword) => {
  return await UserModel.findOneAndUpdate(
    { username: userID },
    { password: newPassword }
  );
};

// Functions that interact with Redis (JWT token blacklist)
export const isBlacklisted = async (token) => {
  const inBlacklist = await redisClient.get(`bl_${token}`);
  return inBlacklist;
};

export const blacklist = async (token) => {
  const token_key = `bl_${token}`;
  return await redisClient.set(token_key, token, { EX: 60 * 60 * 24 * 7 });
};

// Functions that interact with Cloudinary (Profile picture host)
export const uploadImage = async (userID, imageURI) => {
  const uploadResp = await cloudinary.v2.uploader.upload(imageURI);
  const updateResp = await UserModel.findOneAndUpdate(
    { username: userID },
    { imageId: uploadResp.public_id, imageUrl: uploadResp.secure_url },
    { new: true }
  );

  return { updateResp: updateResp, imageUrl: uploadResp.secure_url };
};

export const removeImage = async (userID) => {
  const findResp = await findUser(userID);
  const removeResp = await cloudinary.v2.uploader.destroy(findResp.imageId);
  const updateResp = await UserModel.findOneAndUpdate(
    { username: userID },
    { imageId: null, imageUrl: null },
    { new: true }
  );
  return { updateResp: updateResp, isSuccess: removeResp };
};
