import axios from 'axios';
import { URL_USER_SVC } from '../../configs.js';
import {
  STATUS_CODE_CONFLICT,
  STATUS_CODE_CREATED,
  STATUS_CODE_OK,
  STATUS_CODE_UNAUTHORIZED,
} from '../../constants.js';

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
      console.log(err.response.status);
      return { isSuccess: false, message: err.response.data.message };
    });
  return res;
};

export const deleteAccount = async (password) => {
  const res = await axios
    .delete(URL_USER_SVC + '/auth', {
      data: { password: password },
      withCredentials: true,
    })
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

export const requestPasswordReset = async (email) => {
  const res = await axios
    .post(URL_USER_SVC + '/requestPasswordReset', {
      email: email,
    })
    .then((res) => {
      return { isSuccess: true, message: res.data.message };
    })
    .catch((err) => {
      return { isSuccess: false, message: err.response.data.message };
    });
  return res;
};

export const resetPassword = async (newPassword, resetToken) => {
  const res = await axios
    .post(
      URL_USER_SVC + '/resetPassword',
      {
        newPassword: newPassword,
      },
      {
        headers: { Authorization: `Bearer ${resetToken}` },
      }
    )
    .then((res) => {
      return { isSuccess: true, message: res.data.message };
    })
    .catch((err) => {
      return { isSuccess: false, message: err.response.data.message };
    });
  return res;
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

export const removeAvatarImage = async () => {
  const success = await axios
    .delete(URL_USER_SVC + '/auth/removeImage', { withCredentials: true })
    .then((res) => {
      if (res.status === STATUS_CODE_OK) return true;
    })
    .catch((err) => {
      return false;
    });
  return success;
};
