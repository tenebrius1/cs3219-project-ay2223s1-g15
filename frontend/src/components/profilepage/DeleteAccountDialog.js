import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC } from "../../configs";

const DeleteAccountDialog = ({ open, onClose }) => {
  const [password, setPassword] = useState("");
  const handleDeleteAccount = async () => {
    await axios.delete(URL_USER_SVC, { password }, { withCredentials: true });
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth>
      <DialogTitle>
        Delete account
        {onClose ? (
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "#D8DEE9",
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <Box
        sx={{
          marginLeft: "4%",
          marginRight: "4%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography>
          Are you sure you want to delete your account? This action is permanent
          and non-reversible!
        </Typography>
        <TextField
          label="Enter password to confirm"
          color="secondary"
          variant="standard"
          sx={{
            marginTop: "3%",
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "3%",
            marginBottom: "3%",
          }}
        >
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteAccount}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DeleteAccountDialog;
