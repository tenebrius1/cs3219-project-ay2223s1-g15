import axios from 'axios';
import { URL_HISTORY_SVC } from '../../configs';

export const addHistory = async (
  user,
  title,
  code,
  interviewerNotes,
  personalNotes,
  question,
  difficulty,
  interviewer
) => {
  const res = await axios
    .post(URL_HISTORY_SVC, {
      user,
      title,
      code,
      interviewerNotes,
      personalNotes,
      question,
      difficulty,
      interviewer,
    })
    .then((res) => {});
};
