import { sequelize, pendingMatch, match } from "./match-model.js";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";

// init database, remember to set force: false on production server!
sequelize
  .sync({force: true});

const TIMEOUT_DURATION = 30000;

export const createWaitingUser = async (username, difficultylevel, socketId) => {
  const waitingUser = pendingMatch.build({ userName: username, difficultyLevel: difficultylevel, socketId: socketId });
  return waitingUser;
};

export const deleteWaitingUser = async (username) => {
  await pendingMatch.destroy({
    where: {
      userName: username
    }
  });
};

const _deleteWaitingUsers = async (currentUser, matchedUser) => {
  await pendingMatch.destroy({
    where: {
      userName: currentUser.userName,
      difficultyLevel: currentUser.difficultyLevel
    }
  });
  await pendingMatch.destroy({
    where: {
      userName: matchedUser.userName,
      difficultyLevel: matchedUser.difficultyLevel
    }
  });
};

const _userStillWaiting = async (username) => {
  const user = await pendingMatch.findOne({
    where: {
      userName: username
    }
  });

  return user !== null;
};

export const matchWaitingUser = async (username) => {
  // finds the current user that wants to be matched in the database
  const currentUser = await pendingMatch.findOne({
    where: {
      userName: username
    }
  });

  // handle scenario where user cant be found
  if (currentUser === null) {
    console.log("Could not find current user");
    return null;
  }

  // finds a user that is of the same difficulty and different username from current user
  const matchedUser = await pendingMatch.findOne({
    where: {
      // ensure that user does not match with himself
      userName: {
        [Op.ne]: username
      },
      difficultyLevel: currentUser.difficultyLevel
    }
  });

  // handle scenario where a matched user cannot be found
  if (matchedUser === null) {
    console.log("Could not find a match");
    setTimeout(() => {
      console.log("Removing user due to timeout.");
      if (_userStillWaiting(username)) 
        deleteWaitingUser(username);
    }, TIMEOUT_DURATION);
    return null;
  }

  // remove the 2 users from the pending list and add them to the matched list
  const matchUserObject = { 
    firstUser: currentUser.userName,
    secondUser: matchedUser.userName,
    firstUserSocketId: currentUser.socketId,
    secondUserSocketId: matchedUser.socketId,
    roomId: uuidv4()
  };
  const matchedUsers = match.build(matchUserObject);
  _deleteWaitingUsers(currentUser, matchedUser);

  return matchedUsers;
};
