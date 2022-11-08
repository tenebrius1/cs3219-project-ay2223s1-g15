import { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link, Navigate, useNavigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import { passwordLogin, tokenLogin } from "../../api/user/auth";
import codefilled from "./../../logos/code.png"

function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user, setUser, setImageUrl } = useContext(UserContext);
  const navigate = useNavigate();

  const dialogTitle = "Login failed";
  const dialogMsg = "You've entered the wrong credentials!";

  const handleSignin = async () => {
    const userInfo = await passwordLogin(username, password);
    if (userInfo) {
      setUser(userInfo.username);
      console.log(user);
      setImageUrl(userInfo.imageUrl);
    } else {
      setUser(null);
      setImageUrl(null);
      setIsDialogOpen(true);
    }
  };

  const closeDialog = () => setIsDialogOpen(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    } else {
      const loginWithToken = async () => {
        const userInfo = await tokenLogin();
        if (userInfo) {
          setUser(userInfo.username);
          setImageUrl(userInfo.imageUrl);
          navigate("/dashboard", { replace: true });
        } else {
          setUser(null);
          setImageUrl(null);
        }
      };
      loginWithToken();
    }
  }, [user]);

  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Box className="mainBox">
      <Box className="signInBox">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "2rem" }}>
          <Box sx={{ borderRadius: "100%", backgroundColor: "#ECEFF4"}}>
            <img src={codefilled} height={"50px"} width={"50px"} />
          </Box>
          {/* <a href="https://www.flaticon.com/free-icons/hands-and-gestures" title="hands and gestures icons">Hands and gestures icons created by Andrejs Kirma - Flaticon</a> */}
          <Typography variant={"h2"} >PeerPrep</Typography>
        </Box>
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
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "2rem",
          }}
        >
          <TextField
            label="Password"
            variant="standard"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: "0.5rem" }}
            required
          />
          <Typography
            component={Link}
            to="/passwordreset"
            color="secondary"
            textAlign={"right"}
          >
            Forgot your password?
          </Typography>
        </Box>
        <Box className="normalButton">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>Don't have an account?&nbsp;</Typography>
            <Typography component={Link} to="/signup" color="secondary">
              Sign up!
            </Typography>
          </Box>
          <Button
            variant={"contained"}
            color={"secondary"}
            onClick={handleSignin}
          >
            Sign in
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
            marginLeft: "9%",
            marginRight: "9%",
            marginBottom: "9%",
            display: "flex",
          }}
        >
          <Typography>{dialogMsg}</Typography>
        </Box>
      </Dialog>
    </Box>
  );
}

export default SignInPage;
