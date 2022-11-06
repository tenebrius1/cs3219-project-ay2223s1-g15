import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import { useState, useContext, useEffect } from "react";
import CustomAvatar from "./CustomAvatar";
import RoomContext from "../../contexts/RoomContext";
import UserContext from "../../contexts/UserContext";

function Dashboard() {
  const [buttonToggleEasy, setButtonToggleEasy] = useState(false);
  const [buttonToggleMedium, setButtonToggleMedium] = useState(false);
  const [buttonToggleHard, setButtonToggleHard] = useState(false);
  const [isMatchWithoutDifficulty, setIsMatchWithoutDifficulty] =
    useState(false);

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
    date,
    time,
    interviewer,
    difficulty,
    interviewerNotes,
    personalNotes,
  }) => {
    console.log("hi");
    navigate("/history", {
      state: {
        title,
        question,
        code,
        date,
        time,
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

  return (
    <Box className="mainDashboardBox">
      <Box className="topBar">
        <Typography component={"h3"} variant={"h5"}>
          PeerPrep
        </Typography>
        <CustomAvatar />
      </Box>
      <Box className="mainContent">
        <Box className="leftBox">
          <Typography>Practice history</Typography>
          <List component="nav" aria-label="mailbox folders">
            <Divider />
            <ListItem
              button
              onClick={() =>
                handleHistoryClick({
                  title: "Two sum",
                  question:
                    "Proident nostrud enim enim anim nulla. Ex culpa tempor consectetur elit id laborum reprehenderit deserunt aliquip ex. Pariatur Lorem pariatur tempor veniam est elit exercitation nisi exercitation ipsum deserunt dolore eu est. Aliqua et ullamco eu proident in consectetur nostrud ipsum elit ullamco esse incididunt. Aute nostrud ad magna aliquip. Et id magna nostrud anim dolore in adipisicing cillum minim ullamco qui occaecat. Commodo exercitation nulla consequat consectetur veniam. Consectetur excepteur et veniam laborum quis velit dolore. Enim exercitation sint labore irure Lorem nostrud. Duis amet anim ipsum dolore ex amet consequat ullamco ad ipsum eiusmod eu. Elit do officia magna laboris reprehenderit occaecat ullamco ut nulla velit incididunt commodo. Culpa enim nulla mollit exercitation Lorem eu culpa duis pariatur elit. Aute ipsum ea sit in officia minim eiusmod incididunt. Incididunt adipisicing labore dolor aliqua id cillum duis non esse sunt. Fugiat esse culpa anim duis sint occaecat sit ad consequat sint sunt tempor nostrud. Labore aliquip culpa fugiat occaecat ea dolor in. Tempor anim irure dolor deserunt. Occaecat voluptate dolor fugiat aute cupidatat eiusmod ipsum non consequat minim pariatur irure. Labore incididunt aliqua minim cillum magna ullamco et aute quis pariatur dolore. Reprehenderit exercitation aute aliquip sint est excepteur. Consequat consectetur aute anim cupidatat mollit aute ipsum deserunt commodo dolor cillum dolore ut. Excepteur amet anim sint quis duis aliqua anim est reprehenderit eiusmod aliquip nostrud pariatur incididunt. Qui ipsum excepteur nisi proident. Sunt qui fugiat ex duis nulla esse cupidatat ut consequat quis irure velit cillum aute. Pariatur consequat proident ea laborum commodo minim laborum esse do occaecat excepteur adipisicing id aute. Pariatur qui Lorem officia enim. Mollit tempor in proident duis sit ex ipsum ullamco laborum eiusmod commodo. Fugiat labore et occaecat pariatur eu quis labore exercitation.",
                  code: "Reprehenderit non Lorem nisi dolor sint consequat cupidatat enim. Culpa mollit est ex proident est ex sunt sint amet commodo sunt proident ut. Cillum fugiat qui culpa voluptate tempor amet id sint sint voluptate cillum enim reprehenderit. In aliqua officia irure ex adipisicing officia velit fugiat. Veniam veniam ea do minim nulla qui duis incididunt elit quis quis enim aliquip. Ex esse cillum ut cillum in cillum. Exercitation amet sunt mollit commodo quis nulla sit ad ut nulla tempor excepteur consectetur qui. Cupidatat enim tempor excepteur sint incididunt labore et. Sunt incididunt consectetur pariatur ex tempor eiusmod aute ex ea occaecat culpa ad. Sint exercitation laboris qui fugiat ad. Nisi anim qui veniam minim do pariatur laboris consequat. Sit dolor qui ex eu reprehenderit magna proident minim nisi anim pariatur quis. Sit reprehenderit nulla ut laboris minim. Officia sunt enim esse tempor aute laborum voluptate. In aute Lorem eu excepteur esse minim cupidatat excepteur et dolor aliquip ut excepteur non. Cillum eiusmod sint laborum ad pariatur cillum ut. Dolor do ea exercitation deserunt dolore ipsum esse minim cupidatat. Velit magna quis id ut in. Commodo exercitation anim quis tempor. Est aliquip exercitation est duis eiusmod reprehenderit ullamco in in laborum duis sit commodo. Dolore dolore elit adipisicing est exercitation. Officia veniam est do enim sint cupidatat aute aliquip quis ullamco. Ea aliqua eu quis eu deserunt velit anim esse. Proident veniam adipisicing reprehenderit et minim tempor minim consectetur ullamco eiusmod exercitation tempor.",
                  date: "5 November 2022",
                  time: "20:20",
                  interviewer: "Me",
                  difficulty: "Easy",
                  interviewerNotes:
                    "Quis magna eiusmod tempor eiusmod eu elit in Lorem cupidatat deserunt cupidatat incididunt sit. Excepteur laborum sint veniam ullamco do sunt. Cupidatat aliqua eu nisi qui laborum ipsum ullamco tempor veniam. Amet ex exercitation eiusmod qui aliqua aliqua aliquip ea nisi exercitation. Reprehenderit ex laboris cillum dolor cillum excepteur occaecat adipisicing ea dolor in. Adipisicing eiusmod fugiat dolore occaecat esse irure est et est ad sit. Aliquip do ea aliqua veniam. Est veniam sit incididunt et mollit. Cupidatat esse reprehenderit do magna elit mollit irure sint nisi. Sint aute officia consectetur ad excepteur minim ea nisi culpa sit qui elit excepteur. Ipsum ullamco dolor commodo consequat esse mollit veniam ad id. Excepteur veniam cillum et esse consequat sint et et ea laboris voluptate. Proident aliquip id tempor voluptate ad. Nulla est voluptate elit irure qui mollit duis anim. In eu laborum exercitation adipisicing voluptate veniam reprehenderit eiusmod nulla aliquip ad mollit anim ad. Nulla sunt incididunt non deserunt dolor. Cupidatat esse nisi proident adipisicing. Elit consectetur deserunt commodo esse mollit excepteur laboris aliquip culpa commodo dolore. Sunt quis esse aliquip est cillum ex aute nisi laboris amet sit aute est. Aliquip sint adipisicing sint aliquip qui voluptate laborum aute sunt exercitation excepteur. Officia ad officia proident commodo proident laboris magna duis laborum sunt exercitation ipsum. Sint qui eu incididunt tempor in sit proident veniam. Do sunt reprehenderit ut sunt sit cillum et. Est consectetur mollit ea esse veniam non labore. Commodo dolore mollit ipsum aliqua sint tempor sit excepteur consequat. Duis minim Lorem qui irure Lorem do laboris nostrud excepteur est proident sit. Pariatur nostrud veniam laboris esse consequat ad labore amet. In minim tempor commodo anim exercitation magna pariatur laboris eu fugiat nulla ad.",
                  personalNotes:
                    "Quis ullamco incididunt sit commodo ea sunt irure sint ea ut exercitation. Reprehenderit duis adipisicing pariatur ex ex qui nostrud eiusmod elit aliquip. Nisi nostrud enim ad id est non. Dolore nostrud voluptate fugiat non. Ea qui ipsum ex laborum Lorem in reprehenderit sit pariatur est veniam officia ad veniam. Aliqua veniam velit eiusmod labore qui non nostrud elit laboris enim nisi adipisicing. Do nostrud officia consectetur labore mollit laboris mollit veniam culpa tempor do. Magna officia aliqua ut elit duis duis cillum pariatur elit dolore. Occaecat voluptate laborum enim fugiat sit incididunt sit pariatur. Consequat excepteur ea cupidatat reprehenderit ipsum reprehenderit ex minim id dolor elit ex id. Amet occaecat reprehenderit sit laboris eiusmod tempor aliquip incididunt cupidatat officia velit. Est proident dolore dolor consequat consectetur nulla ex non. Id commodo non nulla et amet Lorem aliqua anim minim deserunt nisi. Eiusmod labore in sint voluptate irure adipisicing dolore id ex id occaecat in ea. Fugiat qui non laboris dolor occaecat nulla Lorem mollit cupidatat adipisicing veniam esse dolore consectetur. Tempor voluptate reprehenderit cupidatat occaecat non Lorem mollit eu. Anim occaecat id in labore cillum. Labore veniam Lorem ullamco quis et eu ad amet velit ullamco aliqua. Dolore sunt cupidatat adipisicing laborum deserunt laborum. Sunt aute consequat adipisicing deserunt amet est irure quis qui velit esse id. Sit eu ullamco exercitation esse.",
                })
              }
            >
              Two sum, 20:20, 5 November 2022 by Interviewer
            </ListItem>
            <Divider />
            <ListItem button divider>
              <ListItemText primary="Drafts" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Trash" />
            </ListItem>
          </List>
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
