import axios from 'axios';
import { URL_QUESTION_SVC } from '../configs';
export const generateRandomQuestion = async (difficulty) => {
  const res = await axios
    .get(URL_QUESTION_SVC + `/randomQuestion/?difficulty=${difficulty}`, {
      withCredentials: true,
    })
    .then((res) => {
      if (res && res.data) {
        return JSON.parse(res.data);
      }
    })
    .catch((err) => console.log(err));
  return res;
};
