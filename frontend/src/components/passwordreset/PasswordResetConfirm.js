import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import "./passwordResetConfirm.css";
import { resetPassword } from "../../api/user/user";
import zxcvbn from "zxcvbn";
import { REQUIRED_PASSWORD_STRENGTH } from "../../constants";
import Paper from "@mui/material/Paper";
import peerprep from "./../../logos/peerprep.png";

const PasswordResetConfirm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [hasResetPassword, setHasResetPassword] = useState(false);

  const { resetToken } = useParams();
  const navigate = useNavigate();

  const isPasswordSecure = () => {
    if (zxcvbn(newPassword).score < REQUIRED_PASSWORD_STRENGTH) {
      return false;
    } else {
      return true;
    }
  };

  const handlePasswordReset = async () => {
    setErrMsg("");
    setHasResetPassword(false);
    if (newPassword !== confirmPassword) {
      setErrMsg("Passwords do not match");
      return;
    }
    if (!isPasswordSecure()) {
      setErrMsg("New password is not strong enough!");
      return;
    }
    const resetResp = await resetPassword(newPassword, resetToken);
    if (!resetResp.isSuccess) {
      setErrMsg(resetResp.message);
      return;
    }
    setHasResetPassword(true);
  };

  return (
    <Box className="mainBox">
      <Paper elevation={5} sx={{width: "50vw", height: "85vh", backgroundColor: "#3B4252"}}>
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", width: "100%"}}>
          <Box className="signInBox">
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "2rem" }}>
              <Box sx={{ marginRight: "3%" }}>
                <img src={peerprep} height={"50px"} width={"50px"} alt="PeerPrep logo" />
              </Box>
              {/* <a href="https://www.flaticon.com/free-icons/hands-and-gestures" title="hands and gestures icons">Hands and gestures icons created by Andrejs Kirma - Flaticon</a> */}
              <Typography variant={"h2"} >PeerPrep</Typography>
            </Box>
            <Typography
              variant="h3"
              component={"h1"}
              marginBottom={"2rem"}
              textAlign={"center"}
            >
              Reset password
            </Typography>
          </Box>
          {hasResetPassword ? (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography>Your password has successfully been reset!</Typography>
              <Button
                variant={"contained"}
                color={"secondary"}
                onClick={() => {
                  navigate("/login", { replace: true });
                }}
                sx={{ marginTop: "1rem" }}
              >
                To sign in page
              </Button>
            </Box>
          ) : (
            <Box className="textFieldBox">
              <TextField
                label="New Password"
                variant="filled"
                type="password"
                color="secondary"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ marginBottom: "1rem" }}
                autoFocus={true}
                required
              />
              <TextField
                label="Confirm Password"
                variant="filled"
                type="password"
                color="secondary"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Typography
                sx={{
                  marginTop: "5px",
                  fontSize: "14px",
                  marginLeft: "5px",
                  color: "red",
                }}
              >
                {errMsg}
              </Typography>

              <Box className="normalResetPasswordConfirmButton">
                <Button
                  variant={"contained"}
                  color={"secondary"}
                  onClick={handlePasswordReset}
                  sx={{ alignItems: "end" }}
                >
                  Reset password
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default PasswordResetConfirm;
