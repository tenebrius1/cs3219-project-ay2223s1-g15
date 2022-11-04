import axios from 'axios';
import { URL_USER_SVC } from '../../configs';
import {
  STATUS_CODE_CONFLICT,
  STATUS_CODE_CREATED,
  STATUS_CODE_OK,
  STATUS_CODE_UNAUTHORIZED,
} from '../../constants';

export const signUp = async (email, username, password) => {
  const res = await axios
    .post(URL_USER_SVC, { email, username, password })
    .then((res) => {
      if (res && res.status === STATUS_CODE_CREATED) {
        return { isSuccess: true, message: 'Account successfully created' };
      }
    })
    .catch((err) => {
      if (err.response.status === STATUS_CODE_CONFLICT) {
        return { isSuccess: false, message: 'This username already exists' };
      } else {
        return { isSuccess: false, message: 'Please try again later' };
      }
    });
  return res;
};

export const changePassword = async (currPassword, newPassword) => {
  const res = await axios
    .put(
      URL_USER_SVC + '/auth/changePW',
      { currPassword, newPassword },
      { withCredentials: true }
    )
    .then((res) => {
      if (res && res.status === STATUS_CODE_OK) {
        return { isSuccess: true, message: res.data.message };
      }
    })
    .catch((err) => {
      return { isSuccess: false, message: err.response.data.message };
    });
  return res;
};

export const deleteAccount = async (password) => {
  await axios
    .delete(URL_USER_SVC, {
      data: { password: password },
      withCredentials: true,
    })
    .then((res) => {})
    .catch((err) => {});
};

export const uploadAvatarImage = async (imageURI) => {
  const imageUrl = await axios
    .post(
      URL_USER_SVC + '/auth/uploadImage',
      { imageURI: imageURI },
      { withCredentials: true }
    )
    .then((res) => {
      return res.data.imageUrl;
    });
  return imageUrl;
};
