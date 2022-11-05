import { useState, useContext, useEffect } from "react";
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
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState("");
  const [isSigninSuccess, setIsSigninSuccess] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSignin = async () => {
    await auth.passwordLogin(username, password);
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

  const onSignUpClick = () => {
    navigate("/signup");
  };

  useEffect(() => {
    if (auth.user) {
      navigate("/dashboard", { replace: true });
    } else {
      const loginWithToken = async () => {
        const res = await auth.tokenLogin();
        if (res) {
          navigate("/dashboard", { replace: true });
        }
      };
      loginWithToken();
    }
  }, [auth, navigate]);
  
  return (
    (auth.user) ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Box className="mainBox">
        <Box className="signInBox">
          <Typography variant={"h3"} marginBottom={"2rem"} textAlign={"center"}>
            Sign In
          </Typography>
        </Box>
        <Box className="textFieldBox">
          <TextField
            className="TextField"
            label="Username"
            variant="standard"
            color="primary"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ marginBottom: "1rem" }}
            autoFocus
            required
            error={usernameError}
          />
          <TextField
            label="Password"
            variant="standard"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: "2rem" }}
            required
            error={passwordError}
          />
        </Box>
        <Box
          className="normalButtons"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly"
          }}
        >
          <Button variant={"outlined"} color={"secondary"} onClick={onSignUpClick}>Sign up</Button>
          <Button variant={"outlined"} color={"secondary"} onClick={handleSignin}>
            Sign in
          </Button>
        </Box>

        <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogMsg}</DialogContentText>
          </DialogContent>
          <DialogActions>
            {isSigninSuccess ? (
              <Button component={Link} to='/login'>
              Log in
              </Button>
            ) : (
              <Button onClick={closeDialog}>Done</Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    )
  );
}

export default SignInPage;
