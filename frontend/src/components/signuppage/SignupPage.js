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
import { REQUIRED_PASSWORD_STRENGTH } from "../../constants";
import peerprep from "./../../logos/peerprep.png";
import Paper from "@mui/material/Paper"

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const navigate = useNavigate();

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
    if (zxcvbn(password).score < REQUIRED_PASSWORD_STRENGTH) {
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
      <Paper elevation={5} sx={{width: "50vw", height: "85vh", backgroundColor: "#3B4252"}}>
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", width: "100%"}}>
          <Box className="signUpBox">
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "2rem" }}>
              <Box sx={{ marginRight: "3%" }}>
                <img src={peerprep} height={"50px"} width={"50px"} alt="PeerPrep logo" />
              </Box>
              {/* <a href="https://www.flaticon.com/free-icons/hands-and-gestures" title="hands and gestures icons">Hands and gestures icons created by Andrejs Kirma - Flaticon</a> */}
              <Typography variant={"h2"} >PeerPrep</Typography>
            </Box>
          </Box>
          <Typography variant={"h3"} marginBottom={"2rem"} textAlign={"center"}>
            Sign up
          </Typography>
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
      </Paper>
    </Box>
  );
}

export default SignupPage;
