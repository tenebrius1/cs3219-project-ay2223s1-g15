import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "./dashboard.css";
import { useState } from "react";
import CustomAvatar from "./CustomAvatar";

function Dashboard() {
  const [buttonToggleEasy, setButtonToggleEasy] = useState(false);
  const [buttonToggleMedium, setButtonToggleMedium] = useState(false);
  const [buttonToggleHard, setButtonToggleHard] = useState(false);

  const toggleButtonEasy = (event) => {
    event.preventDefault();
    if (buttonToggleMedium) {
      setButtonToggleMedium(false);
    }
    if (buttonToggleHard) {
      setButtonToggleHard(false);
    }
    setButtonToggleEasy(!buttonToggleEasy);
  };

  const toggleButtonMedium = (event) => {
    event.preventDefault();
    if (buttonToggleEasy) {
      setButtonToggleEasy(false);
    }
    if (buttonToggleHard) {
      setButtonToggleHard(false);
    }
    setButtonToggleMedium(!buttonToggleMedium);
  };

  const toggleButtonHard = (event) => {
    event.preventDefault();
    if (buttonToggleEasy) {
      setButtonToggleEasy(false);
    }
    if (buttonToggleMedium) {
      setButtonToggleMedium(false);
    }
    setButtonToggleHard(!buttonToggleHard);
  };

  const handleClickEasy = () => (buttonToggleEasy ? "contained" : "outlined");
  const handleClickMedium = () =>
    buttonToggleMedium ? "contained" : "outlined";
  const handleClickHard = () => (buttonToggleHard ? "contained" : "outlined");

  return (
    <Box className="mainDashboardBox">
      <Box className="topBar">
        <Typography component={"h3"} variant={"h5"}>
          PeerPrep
        </Typography>
        <CustomAvatar />
      </Box>
      <Box className="mainContent">
        <Box className="leftBox">Practice History</Box>
        <Box className="rightBox">
          <Typography
            className="difficultyButton"
            component={"h3"}
            variant={"h5"}
          >
            Difficulty
          </Typography>
          <Button
            className="difficultyButton"
            color={"success"}
            variant={handleClickEasy()}
            onClick={toggleButtonEasy}
          >
            Easy
          </Button>
          <Button
            className="difficultyButton"
            color={"warning"}
            variant={handleClickMedium()}
            onClick={toggleButtonMedium}
          >
            Medium
          </Button>
          <Button
            className="difficultyButton"
            color={"error"}
            variant={handleClickHard()}
            onClick={toggleButtonHard}
          >
            Hard
          </Button>
          <Button
            className="queueUpButton"
            color={"info"}
            variant={"contained"}
            component={Link}
            to="/matching"
          >
            Practise
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
