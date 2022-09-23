import { pendingMatch, match } from './match-model.js'
import { Op } from 'sequelize'
import { sequelize } from './match-model.js';
import { v4 as uuidv4 } from 'uuid';

// init database
sequelize
  .sync({force: true})
  .then(() => console.log('db connected'))

export const createWaitingUser = async (username, difficultylevel) => {
  const waitingUser = pendingMatch.build({ userName: username, difficultyLevel: difficultylevel });
  return waitingUser;
}

_deleteWaitingUsers = async (currentUser, matchedUser) => {
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
}

export const matchWaitingUser = async (username) => {
  // finds the current user that wants to be matched in the database
  const currentUser = await pendingMatch.findOne({
    where: {
      userName: username
    }
  });

  // handle scenario where user cant be found
  if (currentUser === null) {
    console.log('Could not find current user');
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
    console.log('Could not find a match');
    return null;
  }

  // remove the 2 users from the pending list and add them to the matched list
  const matchedUsers = match.build({ firstUser: currentUser.userName, secondUser: matchedUser.userName, roomId: uuidv4() });
  _deleteWaitingUsers(currentUser, matchedUser);

  return matchedUsers;
}
