import { createWaitingUser, matchWaitingUser, deleteWaitingUser } from "./repsitory.js";

//need to separate orm functions from repository to decouple business logic from persistence
export const ormCreateWaitingUser = async (username, difficultylevel, socketId) => {
  try {
    const newWaitingUser = await createWaitingUser(username, difficultylevel, socketId);
    newWaitingUser.save();
    return true;
  } catch (err) {
    console.error(err);
    console.log("ERROR: Could not create a waiting user");
    return { err };
  }
};

export const ormDeleteWaitingUser = async (username) => {
  try {
    await deleteWaitingUser(username);
    return true;
  } catch (err) {
    return { err };
  }
};

export const ormCreateMatchedUsers = async (waitingUser) => {
  try {
    const matchedUsers = await matchWaitingUser(waitingUser);
    if (matchedUsers === null) {
      return false;
    } else {
      matchedUsers.save();
      const returnObject = {
        roomId: matchedUsers.roomId,
        firstUserSocketId: matchedUsers.firstUserSocketId,
        secondUserSocketId: matchedUsers.secondUserSocketId
      };
      return returnObject;
    }
  } catch (err) {
    return { err };
  }
};
