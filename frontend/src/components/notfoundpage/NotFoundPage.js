import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const handleBackToLogin = () => {
    navigate("/dashboard", { replace: true });
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography>Sorry this page doesn't exist! :(</Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            marginTop: "3%",
          }}
          onClick={handleBackToLogin}
        >
          Back to dashboard
        </Button>
      </Box>
    </>
  );
};

export default NotFoundPage;
