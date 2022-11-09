import { addHistory, getUserHistory } from './repository.js';
import moment from 'moment-timezone';

export const ormAddHistory = async (user, title, code, notes, question, difficulty) => {
  try {
    const newUserHistory = await addHistory({
      user,
      title,
      code,
      notes,
      question,
      difficulty,
      timestamp: moment.tz(Date.now(), 'Asia/Singapore').format('HH:mm:ss DD-MM-YYYY'),
    });
    newUserHistory.save();
    console.log(`Add history for ${user}`);
    return true;
  } catch (err) {
    console.log(`ERROR: Could not add history for ${user}`);
    return { err };
  }
};

export const ormGetUserHistory = async (user) => {
  try {
    const history = await getUserHistory(user);

    if (history.length) {
      return history;
    }

    return {};
  } catch (err) {
    return { err };
  }
};
