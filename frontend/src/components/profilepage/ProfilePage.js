import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import './profilepage.css';
import AvatarSelectDialog from './AvatarSelectDialog';
import { URL_USER_SVC } from '../../configs';
import uploadAvatarImage from '../../api/user/uploadAvatarImage';
import UserContext from '../../contexts/UserContext';

const ProfilePage = () => {
  const { user } = useContext(UserContext);
  const [changePassword, setChangePassword] = useState(false);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditAvatar, setIsEditAvatar] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [imgCrop, setImgCrop] = useState(null);
  const [storeImg, setStoreImg] = useState(null);
  const navigate = useNavigate();

  const onClickDeleteAccount = async () => {
    await axios.delete('/');
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return;
    }
    await axios
      .put(
        URL_USER_SVC + '/changePW',
        { currPassword, newPassword },
        { withCredentials: true }
      )
      .catch((e) => console.log(e));
    setChangePassword(false);
  };

  const onClickChangePassword = () => {
    setChangePassword(!changePassword);
  };

  const onClickProfile = () => {
    console.log('hi');
    setIsEditAvatar(true);
  };

  const handleEditAvatarClose = () => {
    setImgCrop(null);
  };

  const handleDialogClose = () => {
    setIsEditAvatar(false);
  };

  const onCrop = (img) => {
    setImgCrop(img);
  };

  const saveImage = async () => {
    const imageUrl = await uploadAvatarImage(imgCrop);
    setStoreImg(imageUrl);
    setIsEditAvatar(false);
  };

  const restoreDefault = () => {
    setStoreImg(null);
    setImgCrop(null);
    setIsEditAvatar(false);
  };

  return (
    <Box className='mainProfilePageBox'>
      <Box className='profilePageVerticalBox'>
        <div className='avatarButtonSection' onClick={onClickProfile}>
          <Avatar
            id='basic-button'
            className='avatarButton'
            src={storeImg}
            width={500}
            margin={'2%'}
          />
          <Button
            className='editAvatarButton'
            variant='contained'
            color='primary'
            startIcon={<EditOutlinedIcon />}
            disableRipple
            disableTouchRipple
          >
            Edit
          </Button>
        </div>
        <div className='profilePageAdminPage'>
          <Typography variant='h4' sx={{ textAlign: 'center' }}>
            {user}
          </Typography>
          {changePassword ? (
            <>
              <Box className='changePasswordBox'>
                <TextField
                  label='Current password'
                  variant='outlined'
                  type='password'
                  onChange={(e) => setCurrPassword(e.target.value)}
                />
                <TextField
                  label='New password'
                  variant='outlined'
                  type='password'
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  label='Confirm new password'
                  variant='outlined'
                  type='password'
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Box className='profilePageConfirmationBox'>
                  <Button
                    variant='outlined'
                    color='error'
                    onClick={onClickChangePassword}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={handleChangePassword}
                  >
                    Confirm
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box className='profilePageConfirmationBox'>
                <Button variant='outlined' color='error' onClick={onClickDeleteAccount}>
                  Delete account
                </Button>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={onClickChangePassword}
                >
                  Change password
                </Button>
              </Box>
            </>
          )}
        </div>
      </Box>
      <AvatarSelectDialog
        open={isEditAvatar}
        onClose={handleEditAvatarClose}
        selectedValue={selectedValue}
        onCrop={onCrop}
        saveImage={saveImage}
        restoreDefault={restoreDefault}
        handleDialogClose={handleDialogClose}
      />
    </Box>
  );
};

export default ProfilePage;
