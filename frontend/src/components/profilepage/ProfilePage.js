import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import "./profilepage.css";
import AvatarSelectDialog from "./AvatarSelectDialog";
import { removeAvatarImage, uploadAvatarImage } from "../../api/user/user";
import UserContext from "../../contexts/UserContext";
import DeleteAccount from "./DeleteAccount";
import ChangePassword from "./ChangePassword";

const ProfilePage = () => {
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isDeleteAccount, setIsDeleteAccount] = useState(false);
  const [isEditAvatar, setIsEditAvatar] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [imgCrop, setImgCrop] = useState(null);

  const onClickDeleteAccount = () => {
    setIsDeleteAccount(true);
  };

  const handleCancelDeleteAccount = () => {
    setIsDeleteAccount(false);
  };

  const { user, imageUrl, setImageUrl } = useContext(UserContext);

  const onClickProfile = () => {
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
    const uploadedImageUrl = await uploadAvatarImage(imgCrop);
    setImageUrl(uploadedImageUrl);
    setIsEditAvatar(false);
  };

  const restoreDefault = async () => {
    const isRemovalSuccess = await removeAvatarImage();
    setImageUrl(null);
    setImgCrop(null);
    setIsEditAvatar(false);
  };

  return (
    <Box className="mainProfilePageBox">
      <Box className="profilePageVerticalBox">
        <div className="avatarButtonSection" onClick={onClickProfile}>
          <Avatar
            id="basic-button"
            className="avatarButton"
            src={imageUrl}
            width={500}
            margin={"2%"}
          />
          <Button
            className="editAvatarButton"
            variant="contained"
            color="primary"
            startIcon={<EditOutlinedIcon />}
            disableRipple
            disableTouchRipple
          >
            Edit
          </Button>
        </div>
        <div className="profilePageAdminPage">
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            {user}
          </Typography>
          {isChangePassword ? (
            <ChangePassword setShowChangePassword={setIsChangePassword} />
          ) : isDeleteAccount ? (
            <DeleteAccount setShowDeleteAccount={setIsDeleteAccount} />
          ) : (
            <>
              <Box className="profilePageConfirmationBox">
                <Button
                  variant="outlined"
                  color="error"
                  onClick={onClickDeleteAccount}
                  sx={{ borderWidth: "2px", marginRight: "5px" }}
                >
                  Delete account
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setIsChangePassword((prev) => !prev)}
                  sx={{ marginLeft: "5px" }}
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
      <DeleteAccountDialog
        open={isDeleteAccount}
        onClose={handleCancelDeleteAccount}
      />
    </Box>
  );
};

export default ProfilePage;
