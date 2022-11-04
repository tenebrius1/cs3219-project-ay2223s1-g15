import axios from 'axios';
import { URL_USER_SVC } from '../../configs';
import { STATUS_CODE_OK } from '../../constants';

export const passwordLogin = async (username, password) => {
  const res = await axios
    .post(
      URL_USER_SVC + '/passwordLogin',
      { username, password },
      { withCredentials: true }
    )
    .then((res) => {
      if ((res && res.status) === STATUS_CODE_OK) {
        return res.data.user;
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  return res;
};

export const tokenLogin = async () => {
  const res = await axios
    .post(URL_USER_SVC + '/tokenLogin', {}, { withCredentials: true })
    .then((res) => {
      if ((res && res.status) === STATUS_CODE_OK) {
        return res.data.user;
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  return res;
};

export const logout = async () => {
  const res = await axios
    .delete(URL_USER_SVC + '/auth/logout', { withCredentials: true })
    .then((res) => {
      return (res && res.status) === STATUS_CODE_OK;
    })
    .catch((err) => console.log(err));
  return res;
};
