import { useState } from "react";
import { Navigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import { Avatar, DialogTitle } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { STATUS_CODE_OK } from "../../constants";
import ProfilePage from "../profilepage/ProfilePage";

function CustomAvatar() {
  const [anchorElement, setAnchorElement] = useState(null);
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const [isLogout, setIsLogout] = useState(false);
  const [isProfileClick, setIsProfileClick] = useState(false);

  const handleClick = (event) => {
    setAnchorElement(event.currentTarget);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorElement(null);
    setOpen(false);
  };

  const handleLogout = async () => {
    await auth.logout().then((res) => {
      if (res && res.status === STATUS_CODE_OK) {
        setIsLogout(true);
      } else {
        setIsLogout(false);
      }
    });
  };

  const handleProfileClick = () => {
    setIsProfileClick(true);
  };

  const handleProfileClose = () => {
    setIsProfileClick(false);
  };

  return isLogout ? (
    <Navigate to={"/"} replace />
  ) : (
    <>
      <Avatar
        component={Button}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          minWidth: 0,
        }}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorElement}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
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
            height: "90%",
            maxHeight: "90%",
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
