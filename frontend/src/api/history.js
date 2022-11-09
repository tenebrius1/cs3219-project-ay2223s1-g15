import axios from 'axios';
import { URL_HISTORY_SVC } from '../configs';

export const addHistory = async (
  user,
  title,
  code,
  notes,
  question,
  difficulty,
  role
) => {
  console.log(role);
  const res = await axios
    .post(
      URL_HISTORY_SVC,
      {
        user,
        title,
        code,
        notes,
        question,
        difficulty,
      },
      { withCredentials: true }
    )
    .then((res) => {})
    .catch((err) => {
      console.log('could not post history');
    });
};
