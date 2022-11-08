import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import "./passwordresetpage.css";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../api/user/user";
import Paper from "@mui/material/Paper";
import peerprep from "./../../logos/peerprep.png"

const PasswordResetPage = () => {
  const [email, setEmail] = useState("");
  const [hasRequestedPasswordReset, setHasRequestedPasswordReset] =
    useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleRequestPasswordReset = async () => {
    setHasRequestedPasswordReset(false);
    setErrMsg("");
    const requestResp = await requestPasswordReset(email);
    if (!requestResp.isSuccess) {
      setErrMsg(requestResp.message);
      return;
    }
    setHasRequestedPasswordReset(true);
  };

  return (
    <>
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
            <Typography
              variant="h3"
              component={"h1"}
              marginBottom={"2rem"}
              textAlign={"center"}
            >
              Reset password
            </Typography>
            {hasRequestedPasswordReset ? (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography>
                  Please check your email for a link to reset your password!
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "2rem",
                    alignItems: "center",
                  }}
                >
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
              </Box>
            ) : (
              <Box className="textFieldBox">
                <TextField
                  label="Email"
                  variant="filled"
                  color="secondary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus={true}
                  required
                />
                <Typography
                  sx={{
                    marginLeft: "5px",
                    marginTop: "5px",
                    fontSize: "14px",
                    color: "red",
                  }}
                >
                  {errMsg}
                </Typography>
                <Box className="normalResetPasswordPageButton">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
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
                    onClick={handleRequestPasswordReset}
                  >
                    Reset password
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default PasswordResetPage;
