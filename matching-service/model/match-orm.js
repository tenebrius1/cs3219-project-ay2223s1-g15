import { createWaitingUser, matchWaitingUser, deleteWaitingUser } from './repsitory.js'

//need to separate orm functions from repository to decouple business logic from persistence
export const ormCreateWaitingUser = async (username, difficultylevel) => {
  try {
    const newWaitingUser = await createWaitingUser(username, difficultylevel);
    newWaitingUser.save();
    return true;
  } catch (err) {
    console.error(err);
    console.log('ERROR: Could not create a waiting user');
    return { err };
  }
}

export const ormDeleteWaitingUser = async (username) => {
  try {
    await deleteWaitingUser(username);
    return true;
  } catch (err) {
    return { err };
  }
}

export const ormCreateMatchedUsers = async (waitingUser) => {
  try {
    const matchedUser = await matchWaitingUser(waitingUser);
    if (matchedUser === null) {
      return false;
    } else {
      matchedUser.save();
      return matchedUser.roomId;
    }
  } catch (err) {
    return { err };
  }
}
