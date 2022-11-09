import axios from 'axios';
import { URL_HISTORY_SVC } from '../configs';

export const addHistory = async (
  user,
  title,
  code,
  notes,
  question,
  difficulty,
  partner,
  role
) => {
  var res;
  if (role === 'interviewee') {
    res = await axios
      .post(
        URL_HISTORY_SVC,
        {
          user,
          title,
          code,
          notes,
          question,
          difficulty,
          interviewer: partner,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log('history posted');
      })
      .catch((err) => {
        console.log(err.response);
        console.log('could not post history');
      });
  } else {
    res = await axios
      .post(
        URL_HISTORY_SVC,
        {
          user: partner,
          title,
          code,
          notes,
          question,
          difficulty,
          interviewer: user,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log('history posted');
      })
      .catch((err) => {
        console.log(err.response);
        console.log('could not post history');
      });
  }
};
