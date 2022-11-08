import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { changePassword } from "../../api/user/user";
import "./profilepage.css";
import zxcvbn from "zxcvbn";
import { REQUIRED_PASSWORD_STRENGTH } from "../../constants";

const ChangePassword = ({ setShowChangePassword }) => {
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwChangeFail, setPwChangeFail] = useState(false);
  const [pwChangeFailMsg, setPwChangeFailMsg] = useState("");

  const isPasswordSecure = () => {
    if (zxcvbn(newPassword).score < REQUIRED_PASSWORD_STRENGTH) {
      return false;
    } else {
      return true;
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPwChangeFailMsg("New passwords do not match!");
      setPwChangeFail(true);
      return;
    }
    if (!isPasswordSecure()) {
      setPwChangeFailMsg("New password is not strong enough!");
      setPwChangeFail(true);
      return;
    }
    const changeResp = await changePassword(currPassword, confirmPassword);
    if (!changeResp.isSuccess) {
      setPwChangeFailMsg(changeResp.message);
      setPwChangeFail(true);
      return;
    }

    setShowChangePassword(false);
    setCurrPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  return (
    <>
      <Box className="changePasswordBox">
        <TextField
          className="profilePageTextField"
          label="Current password"
          variant="outlined"
          type="password"
          size="small"
          margin="dense"
          required
          onChange={(e) => setCurrPassword(e.target.value)}
        />
        <TextField
          className="profilePageTextField"
          label="New password"
          variant="outlined"
          type="password"
          size="small"
          margin="dense"
          required
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          className="profilePageTextField"
          label="Confirm new password"
          variant="outlined"
          type="password"
          size="small"
          margin="dense"
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {pwChangeFail && (
          <Typography sx={{ color: "red", fontSize: 12 }}>
            {pwChangeFailMsg}
          </Typography>
        )}
        <Box className="profilePageConfirmationBox">
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setShowChangePassword((prev) => !prev);
              setCurrPassword("");
              setNewPassword("");
              setConfirmPassword("");
            }}
            sx={{ borderWidth: "2px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleChangePassword}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ChangePassword;
