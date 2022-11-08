import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import { useState, useContext, useEffect } from "react";
import CustomAvatar from "./CustomAvatar";
import RoomContext from "../../contexts/RoomContext";
import UserContext from "../../contexts/UserContext";
import { URL_HISTORY_SVC } from "../../configs";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import peerprep from "./../../logos/peerprep.png"

function Dashboard() {
  const [buttonToggleEasy, setButtonToggleEasy] = useState(false);
  const [buttonToggleMedium, setButtonToggleMedium] = useState(false);
  const [buttonToggleHard, setButtonToggleHard] = useState(false);
  const [isMatchWithoutDifficulty, setIsMatchWithoutDifficulty] =
    useState(false);
  const [historyList, setHistoryList] = useState([]);

  const navigate = useNavigate();
  const { difficulty, setDifficulty } = useContext(RoomContext);
  const { user } = useContext(UserContext);

  const startMatch = async () => {
    console.log("user", user);
    console.log("difficulty", difficulty);
    navigate("/matching", { replace: true });
  };

  const toggleButtonEasy = (event) => {
    event.preventDefault();
    if (buttonToggleMedium) {
      setButtonToggleMedium(false);
    }
    if (buttonToggleHard) {
      setButtonToggleHard(false);
    }
    if (buttonToggleEasy) {
      setDifficulty("");
    } else {
      setDifficulty("Easy");
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
    if (buttonToggleMedium) {
      setDifficulty("");
    } else {
      setDifficulty("Medium");
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
    if (buttonToggleHard) {
      setDifficulty("");
    } else {
      setDifficulty("Hard");
    }
    setButtonToggleHard(!buttonToggleHard);
  };

  const handleClickEasy = () => (buttonToggleEasy ? "contained" : "outlined");
  const handleClickMedium = () =>
    buttonToggleMedium ? "contained" : "outlined";
  const handleClickHard = () => (buttonToggleHard ? "contained" : "outlined");

  const handleStartMatchWithoutDifficulty = () => {
    setIsMatchWithoutDifficulty(true);
  };

  const handleStartMatchWithoutDifficultyClose = () => {
    setIsMatchWithoutDifficulty(false);
  };

  const handleHistoryClick = ({
    title,
    question,
    code,
    timestamp,
    interviewer,
    difficulty,
    interviewerNotes,
    personalNotes,
  }) => {
    navigate("/history", {
      state: {
        title,
        question,
        code,
        timestamp,
        interviewer,
        difficulty,
        interviewerNotes,
        personalNotes,
      },
    });
  };

  useEffect(() => {
    if (isMatchWithoutDifficulty) {
      setTimeout(() => {
        handleStartMatchWithoutDifficultyClose();
      }, 3000);
    }
  }, [isMatchWithoutDifficulty]);

  useEffect(() => {
    const getHistory = async () => {
      const res = await axios
        .get(URL_HISTORY_SVC + `/?user=${user}`, { withCredentials: true })
        .then(
          (res) =>
            res.data.length &&
            res.data.map(
              (hist) =>
                hist.title &&
                hist.timestamp &&
                hist.interviewer &&
                setHistoryList((histList) => [...histList, hist])
            )
        )
        .then(console.log("historylist", historyList))
        .catch((err) => console.log(err));
    };
    getHistory();
  }, [user]);

  return (
    <Box className="mainDashboardBox">
      <Box className="topBar">
        <Box sx={{display: "flex", alignContent: "center"}}>
          <img src={peerprep} height={"50px"} width={"50px"} alt="PeerPrep logo" />
          <Typography component={"h3"} variant={"h3"} sx={{marginLeft: "3%"}}>
            PeerPrep
          </Typography>
        </Box>
        <CustomAvatar />
      </Box>
      <Box className="mainContent">
        <Box className="leftBox">
          <Typography variant={"h5"}>Practice history</Typography>
          <Divider />
          {historyList.length ? (
            <List component="nav" aria-label="history">
              {historyList.map(
                ({
                  _id,
                  title,
                  code,
                  interviewerNotes,
                  personalNotes,
                  question,
                  difficulty,
                  interviewer,
                  timestamp,
                }) => {
                  return (
                    <>
                      <ListItem
                        key={_id}
                        button
                        onClick={() =>
                          handleHistoryClick({
                            title: title,
                            question: question,
                            code: code,
                            interviewerNotes: interviewerNotes,
                            personalNotes: personalNotes,
                            difficulty: difficulty,
                            interviewer: interviewer,
                            timestamp: timestamp,
                          })
                        }
                      >
                        Problem: {title} <br />
                        Done at: {timestamp} <br />
                        Conducted by: {interviewer}
                      </ListItem>
                      <Divider />
                    </>
                  );
                }
              )}
            </List>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10%",
              }}
            >
              <CircularProgress sx={{ marginBottom: "2%", color: "inherit" }} />
              <Typography>No history to show. Get to practising!</Typography>
            </Box>
          )}
        </Box>
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
            color={"secondary"}
            variant={
              buttonToggleEasy || buttonToggleMedium || buttonToggleHard
                ? "contained"
                : "outlined"
            }
            onClick={
              buttonToggleEasy || buttonToggleMedium || buttonToggleHard
                ? startMatch
                : handleStartMatchWithoutDifficulty
            }
          >
            Practise
          </Button>
          {isMatchWithoutDifficulty && (
            <Alert
              variant="filled"
              severity="error"
              onClose={handleStartMatchWithoutDifficultyClose}
              sx={{
                marginTop: "5%",
              }}
            >
              Please select a difficulty first!
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
