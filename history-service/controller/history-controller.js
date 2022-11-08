import {
  ormAddHistory as _addHistory,
  ormGetUserHistory as _getUserHistory,
} from '../model/history-orm.js'

export const addHistory = async (req, res) => {
  try {
    const { user, title, code, interviewerNotes, personalNotes, question, difficulty, interviewer } = req.body;
    // skip checking of notes since it could be empty 
    if (user && title && code && question && difficulty && interviewer) {
      const resp = await _addHistory(user, title, code, interviewerNotes, personalNotes, question, difficulty, interviewer);
      if (resp.err) {
        return res.status(400).json({ message: "Could not add history" });
      } 
      console.log(`Added new history record for ${user}`);
      return res.status(201).json({ message: `Created new history record for ${user}` });
    } else {
      return res.status(400).json({ message: 'Field/s missing!' });
    }
  } catch (err) {
    return res.status(500).json({ message: "Database failed" });
  }
}

export const getUserHistory = async (req, res) => {
  try {
    const { user } = req.query;
    if (user) {
      const history = await _getUserHistory(user);
      if (history !== {}) {
        return res.status(200).json(history);
      } else {
        return null;
      }
    }
  } catch (err) {
    return res.status(500).json({ message: "Database failed" });
  }
}