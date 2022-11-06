import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";

import { logout } from "../../api/user/auth";
import { useNavigate } from "react-router";

const DeleteSuccessModal = ({ isOpen, handleClose }) => {
  const navigate = useNavigate();
  const onClose = async () => {
    handleClose();
    await logout();
    navigate("/", { replace: true });
  };
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      scroll={"paper"}
      PaperProps={{
        sx: {
          width: "30%",
          height: "30%",
          maxHeight: "30%",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Typography sx={{ textAlign: "center" }}>
        Successfully deleted account
      </Typography>
      <Button
        variant="outlined"
        color="error"
        sx={{ marginTop: "20px", maxWidth: "50%", borderWidth: "2px" }}
        onClick={onClose}
      >
        Logout
      </Button>
    </Dialog>
  );
};

export default DeleteSuccessModal;
