import mongoose from 'mongoose';
import moment from 'moment-timezone';

const dateSingapore = moment.tz(Date.now(), "Asia/Singapore").format();

var Schema = mongoose.Schema;
let HistoryModelSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  question: {
    type: String,
  },
  diificulty: {
    type: String,
  },
  interviewer: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: dateSingapore
  }
});

export default mongoose.model('HistoryModel', HistoryModelSchema);
