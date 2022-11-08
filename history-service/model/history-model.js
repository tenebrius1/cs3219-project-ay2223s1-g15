import mongoose from 'mongoose';
import moment from 'moment-timezone';

const dateSingapore = moment.tz(Date.now(), "Asia/Singapore").format("HH:mm:ss DD-MM-YYYY");

var Schema = mongoose.Schema;
let HistoryModelSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  interviewerNotes: {
    type: String,
  },
  personalNotes: {
    type: String,
  },
  question: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  interviewer: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    default: dateSingapore
  }
});

export default mongoose.model('HistoryModel', HistoryModelSchema);
