import mongoose from 'mongoose';
import 'dotenv/config'
import HistoryModel from './history-model.js'

let mongoDB = process.env.DB_CLOUD_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('connected', () => console.log('connected to MongoDB'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export const addHistory = async (params) => {
  return new HistoryModel(params);
}

export const getUserHistory = async (user) => {
  return await HistoryModel.find({ user: user });
}
