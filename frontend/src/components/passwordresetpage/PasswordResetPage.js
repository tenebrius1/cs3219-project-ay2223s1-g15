import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import "./passwordresetpage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { URL_USER_SVC } from "../../configs";

const PasswordResetPage = () => {
  const [email, setEmail] = useState("");
  const [hasRequestedPasswordReset, setHasRequestedPasswordReset] =
    useState(false);

  const handleRequestPasswordRest = async () => {
    setHasRequestedPasswordReset(true);
    await axios.post(URL_USER_SVC + "/requestPasswordReset", {
      username: email,
    });
  };

  return (
    <>
      <Box className="mainBox">
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
              sx={{ marginBottom: "2rem" }}
              autofocus
              required
            />
            <Box className="normalResetPasswordPageButton">
              <Box sx={{ display: "flex" }}>
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
                onClick={handleRequestPasswordRest}
              >
                Reset password
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default PasswordResetPage;
