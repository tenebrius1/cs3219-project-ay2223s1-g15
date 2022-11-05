import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC } from "./../../configs";
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from "./../../constants";
import { Link } from "react-router-dom";
import "./signuppage.css";
import isEmail from "validator/lib/isEmail";
import zxcvbn from "zxcvbn";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const minPasswordStrength = 1;

  const handleSignup = async () => {
    setIsSignupSuccess(false);
    if (!isEmailValid()) {
      setErrorDialog("Please enter a valid email address");
      return;
    }
    if (!isPasswordSecure()) {
      const error = "Your password is not strong enough.".concat(
        "\n",
        zxcvbn(password).feedback.suggestions
      );
      setErrorDialog(error);
      return;
    }
    const res = await axios
      .post(URL_USER_SVC, { email, username, password })
      .catch((err) => {
        if (err.response.status === STATUS_CODE_CONFLICT) {
          setErrorDialog("This username already exists");
        } else {
          setErrorDialog("Please try again later");
        }
      });
    if (res && res.status === STATUS_CODE_CREATED) {
      setSuccessDialog("Account successfully created");
      setIsSignupSuccess(true);
    }
  };

  const closeDialog = () => setIsDialogOpen(false);

  const setSuccessDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Success");
    setDialogMsg(msg);
  };

  const setErrorDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle("Error");
    setDialogMsg(msg);
  };

  const isEmailValid = () => {
    return isEmail(email);
  };

  const isPasswordSecure = () => {
    if (zxcvbn(password).score < minPasswordStrength) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <Box className="mainBox">
      <Box className="signUpBox">
        <Typography variant={"h3"} marginBottom={"2rem"}>
          Sign Up
        </Typography>
      </Box>
      <Box className="textFieldBox">
        <TextField
          className="TextField"
          label="Email"
          variant="standard"
          color="primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: "1rem" }}
          autoFocus
          required
        />
        <TextField
          className="TextField"
          label="Username"
          variant="standard"
          color="primary"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ marginBottom: "1rem" }}
          required
        />
        <TextField
          label="Password"
          variant="standard"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: "2rem" }}
          required
        />
      </Box>
      <Box
        className="normalButton"
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <Box sx={{display: 'flex'}}>
          <Typography>Already have an account?&nbsp;</Typography>
          <Typography
            component={Link}
            to="/login"
            variant="outlined"
            color="secondary"
          >
            Log in
          </Typography>
        </Box>
        <Button variant={"outlined"} color={"secondary"} onClick={handleSignup}>
          Sign up
        </Button>
      </Box>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {isSignupSuccess ? (
            <Button component={Link} to="/login">
              Log in
            </Button>
          ) : (
            <Button onClick={closeDialog}>Done</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SignupPage;
