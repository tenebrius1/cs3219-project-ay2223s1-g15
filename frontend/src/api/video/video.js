import axios from 'axios';
import { URL_VIDEO_SVC } from '../../configs';
import { STATUS_CODE_OK } from '../../constants';

export const getToken = async (channel) => {
  const res = await axios
    .get(`${URL_VIDEO_SVC}` + '/rtctoken', {
      params: { channel: channel },
      withCredentials: true,
    })
    .then((res) => {
      if (res.status === STATUS_CODE_OK) {
        return res.data.token;
      } else {
        return '';
      }
    })
    .catch((err) => {
      return '';
    });
  return res;
};
