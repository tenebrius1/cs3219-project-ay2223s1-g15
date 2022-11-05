import {
  ormCreateWaitingUser as _createWaitingUser,
  ormCreateMatchedUsers as _persistMatchedUsers,
  ormDeleteWaitingUser as _deleteWaitingUser,
} from "../model/match-orm.js";

export const createWaitingUser = async (username, difficulty, socketId) => {
  try {
    const resp = await _createWaitingUser(username, difficulty, socketId);
    if (resp.err) {
      console.error(err);
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const deleteWaitingUser = async (username) => {
  try {
    const resp = await _deleteWaitingUser(username);
    if (resp.err) {
      console.error(resp.err);
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const matchWaitingUser = async (username) => {
  try {
    const resp = await _persistMatchedUsers(username);
    if (resp.err) {
      console.error(resp.err);
      return false;
    }
    return resp;
  } catch (err) {
    console.error(err);
    return false;
  }
};
