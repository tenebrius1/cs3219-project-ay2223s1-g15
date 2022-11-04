import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import { Avatar, DialogTitle } from '@mui/material';
import UserContext from '../../contexts/UserContext';
import ProfilePage from '../profilepage/ProfilePage';
import { logout } from '../../api/user/auth';

function CustomAvatar() {
  const [anchorElement, setAnchorElement] = useState(null);
  const [open, setOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isProfileClick, setIsProfileClick] = useState(false);

  const { imageUrl } = useContext(UserContext);

  const handleClick = (event) => {
    setAnchorElement(event.currentTarget);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorElement(null);
    setOpen(false);
  };

  const handleLogout = async () => {
    if (await logout()) {
      setIsLogout(true);
    } else {
      setIsLogout(false);
    }
  };

  const handleProfileClick = () => {
    // navgiate('/profile')
    setIsProfileClick(true);
  };

  const handleProfileClose = () => {
    setIsProfileClick(false);
  };

  return isLogout ? (
    <Navigate to={'/'} replace />
  ) : (
    <>
      <Avatar
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          minWidth: 0,
        }}
        src={imageUrl}
      />
      <Menu
        id='basic-menu'
        anchorEl={anchorElement}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <Dialog
        open={isProfileClick}
        onClose={handleProfileClose}
        fullWidth
        PaperProps={{
          sx: {
            height: '90%',
            maxHeight: '90%',
          },
        }}
      >
        <DialogTitle>Profile</DialogTitle>
        <ProfilePage />
      </Dialog>
    </>
  );
}

export default CustomAvatar;
