import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signuppage.css";
import isEmail from "validator/lib/isEmail";
import zxcvbn from "zxcvbn";
import { signUp } from "../../api/user/user";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const navigate = useNavigate();
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
    const signupRes = await signUp(email, username, password);
    if (signupRes.isSuccess) {
      setSuccessDialog(signupRes.message);
      setIsSignupSuccess(true);
    } else {
      setErrorDialog(signupRes.message);
    }
  };

  const closeDialog = () => setIsDialogOpen(false);

  const setSuccessDialog = (msg) => {
    setDialogTitle("Success");
    setDialogMsg(msg);
    setIsDialogOpen(true);
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

  useEffect(() => {
    if (isSignupSuccess) {
      navigate("/login", { replace: true });
    }
  }, [isSignupSuccess]);

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
        <Box
          className="normalButton"
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
          <Button
            variant={"contained"}
            color={"secondary"}
            onClick={handleSignup}
          >
            Sign up
          </Button>
        </Box>
      </Box>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>
          {dialogTitle}
          {closeDialog ? (
            <IconButton
              onClick={closeDialog}
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
            marginLeft: "25px",
            marginRight: "25px",
            marginBottom: "25px",
            display: "flex",
          }}
        >
          <Typography>{dialogMsg}</Typography>
        </Box>
      </Dialog>
    </Box>
  );
}

export default SignupPage;
