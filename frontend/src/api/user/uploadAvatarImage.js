import axios from 'axios';
import { URL_USER_SVC } from '../../configs';

const uploadAvatarImage = async (imageURI) => {
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

export default uploadAvatarImage;
