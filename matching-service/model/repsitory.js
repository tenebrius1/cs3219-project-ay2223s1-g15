import { pendingMatch, match } from './match-model.js'
import { Op } from 'sequelize'
import { sequelize } from './match-model.js';

// init database
sequelize
  .sync({force: true})
  .then(() => console.log('db connected'))

export async function createWaitingUser(username, difficultylevel) {
  const waitingUser = pendingMatch.build({ userName: username, difficultyLevel: difficultylevel });
  return waitingUser;
}

export async function matchWaitingUser(username) {
  const currentUser = await pendingMatch.findOne({
    where: {
      userName: username
    }
  });

  const matchedUser = await pendingMatch.findOne({
    where: {
      // ensure that user does not match with himself
      userName: {
        [Op.ne]: username
      },
      difficultyLevel: currentUser.difficultyLevel
    }
  });

  if (matchedUser === null) {
    console.log('Could not find a match!');
    return false;
  }

  // remove the 2 users from the pending list and add them to the matched list
  const matchedUsers = match.build({ firstUser: currentUser.userName, secondUser: matchedUser.userName });

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

  return matchedUsers;
}
