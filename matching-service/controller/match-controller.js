import { ormCreateWaitingUser as _createWaitingUser, ormPersistMatchedUsers as _persistMatchedUsers } from '../model/match-orm.js'

export async function createWaitingUser(req, res) {
  try {
    const { username, difficultylevel } = req.body;
    if (username && difficultylevel) {
      const resp = await _createWaitingUser(username, difficultylevel);
      if (resp.err) {
        res.status(400).json({ message: 'Could not create a new waiting user!' });
      } else {
        return res.status(201).json({ message: `Created new waiting user ${username} successfully!` });
      }
    } else {
      return res.status(400).json({ message: 'Username and/or Difficulty Level are missing!' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Database failure when creating new waiting user!' });
  }
}

export async function matchWaitingUser(username) {
  try {
    const resp = await _persistMatchedUsers(username);
    if (resp.err) {
      console.error(resp.err);
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.error(err);
    return false
  }
}