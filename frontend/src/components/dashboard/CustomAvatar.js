import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Avatar } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { URL_USER_SVC } from "../../configs";
import { STATUS_CODE_OK } from "../../constants";
import axios from "axios";

function CustomAvatar() {
  const [anchorElement, setAnchorElement] = useState(null);
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const [isLogout, setIsLogout] = useState(false)

  const handleClick = (event) => {
    setAnchorElement(event.currentTarget);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorElement(null);
    setOpen(false);
  };

  const handleLogout = async () => {
    await auth.logout().then(res => {
      if (res && res.status === STATUS_CODE_OK) {
        console.log('hello' + res.status)
        setIsLogout(true)
      } else {
        setIsLogout(false)
      }
    });
  }

  return (
    (isLogout) ? (
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
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>
      </>
      )
  );
}

export default CustomAvatar;
