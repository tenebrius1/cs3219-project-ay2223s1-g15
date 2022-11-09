import mongoose from 'mongoose';
import moment from 'moment-timezone';

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
  notes: {
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
  timestamp: {
    type: String,
    default: moment.tz(Date.now(), 'Asia/Singapore').format('HH:mm:ss DD-MM-YYYY'),
  },
});

export default mongoose.model('HistoryModel', HistoryModelSchema);
