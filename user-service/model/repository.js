import UserModel from './user-model.js';
import 'dotenv/config';
import redis from 'redis';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB =
    process.env.ENV == 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('connected', () => console.log('connected to MongoDB'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const redisClient = redis.createClient({
    url: `redis://default:${process.env.REDIS_PW}@redis-14796.c285.us-west-2-2.ec2.cloud.redislabs.com:14796`,
});

redisClient.on('connect', () => console.log('connected to Redis'));
redisClient.on('error', console.error);
await redisClient.connect();

// Functions that interact with MongoDB (user data)
export async function createUser(params) {
    return new UserModel(params);
}

export async function exists(userID) {
    return await UserModel.exists({ username: userID });
}

export async function findUser(userID) {
    return await UserModel.findOne({ username: userID });
}

export async function deleteUser(userID) {
    return await UserModel.findOneAndDelete({ username: userID });
}

export async function changePassword(userID, newPassword) {
    return await UserModel.findOneAndUpdate(
        { username: userID },
        { password: newPassword }
    );
}

// Functions that interact with Redis (JWT token blacklist)
export async function isBlacklisted(token) {
    const inBlacklist = await redisClient.get(`bl_${token}`);
    return inBlacklist;
}

export async function blacklist(token) {
    const token_key = `bl_${token}`;
    return await redisClient.set(token_key, token);
}
