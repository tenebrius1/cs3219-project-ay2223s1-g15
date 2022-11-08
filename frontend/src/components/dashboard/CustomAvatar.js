import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import UserContext from "../../contexts/UserContext";
import ProfilePage from "../profilepage/ProfilePage";
import { logout } from "../../api/user/auth";

function CustomAvatar() {
  const [anchorElement, setAnchorElement] = useState(null);
  const [open, setOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isProfileClick, setIsProfileClick] = useState(false);

  const { user, imageUrl } = useContext(UserContext);

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
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          minWidth: 0,
        }}
        src={imageUrl}
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
        <MenuItem onClick={handleProfileClick}>{user ? user : "Profile"}</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <Dialog
        open={isProfileClick}
        onClose={handleProfileClose}
        fullWidth
        scroll={"paper"}
        PaperProps={{
          sx: {
            height: "90%",
            maxHeight: "90%",
          },
        }}
      >
        <DialogTitle>
          Profile
          {handleProfileClose && (
            <IconButton
              onClick={handleProfileClose}
              sx={{
                position: "absolute",
                right: 12,
                top: 12,
                color: "#D8DEE9",
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <ProfilePage />
      </Dialog>
    </>
  );
}

export default CustomAvatar;
