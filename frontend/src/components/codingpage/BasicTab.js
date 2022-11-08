import { useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Backdrop, CircularProgress } from '@mui/material';
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import TabPanel from "./TabPanel";
import "./codingpage.css";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { URL_QUESTION_SVC } from "../../configs";
import RoomContext from "../../contexts/RoomContext";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../confirmationdialog/ConfirmationDialog";
import Divider from "@mui/material/Divider";

function BasicTab({ output,inCall }) {
  const [value, setValue] = useState(0);
  const [tabPanelHeight, setTabPanelHeight] = useState("80vh");

  useEffect(()=> {
    console.log(inCall)
    if (inCall) {
      setTabPanelHeight("60vh")
    } else {
      setTabPanelHeight("80vh")
    }
  }, [inCall])
  const [isEndTurn, setIsEndTurn] = useState(false);
  const [isEndTurnConfirm, setIsEndTurnConfirm] = useState(false);
  const [question, setQuestion] = useState({});
  const { roomId, difficulty } = useContext(RoomContext);
  const [difficultyColor, setDifficultyColor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const getRandomQuestionError =
    "Sorry but question could not be loaded at this time!";

  const navigate = useNavigate();

  const decideDifficultyColor = () => {
    if (difficulty === "Easy") {
      setDifficultyColor("green");
    } else if (difficulty === "Medium") {
      setDifficultyColor("orange");
    } else if (difficulty === "Hard") {
      setDifficultyColor("red");
    } else {
      setDifficultyColor("white");
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleEndTurn = () => {
    // actually end turn
    setIsEndTurn(true);
  };

  const handleEndTurnCancel = () => {
    // cancel ending turn process
    setIsEndTurn(false);
  };

  const handleEndTurnConfirm = () => {
    // open confirmation modal
    setIsEndTurnConfirm(true);
    setIsEndTurn(false);
  };

  const handleEndTurnConfirmCancel = () => {
    // closes confirmation modal
    setIsEndTurnConfirm(false);
  };

  useEffect(() => {
    if (!roomId || !difficulty) {
      console.log("hi");
      navigate("/dashboard", { replace: true });
    }
    const generateRandomQuestion = async () => {
      const res = await axios
        .get(URL_QUESTION_SVC + `/randomQuestion/?difficulty=${difficulty}`, {
          withCredentials: true,
        })
        .then((res) => {
          res && res.data && setQuestion(JSON.parse(res.data));
          decideDifficultyColor();
          setIsLoading(false);
        })
        .catch((err) => console.log(err));
    };
    generateRandomQuestion();
  }, []);

  return (
    <>

      <Box className="adminArea">
        <>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
        <Box sx={{ borderColor: "divider" }}>
          <Tabs
            value={value}
            variant={"fullWidth"}
            onChange={handleChange}
            aria-label="basic tabs example"
            textColor={"secondary"}
            indicatorColor={"secondary"}
          >
            <Tab label="Question" {...a11yProps(0)} />
            <Tab label="Notes" {...a11yProps(1)} />
            <Tab label="Output" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel
          children={
            <>
              <Divider textAlign="left">Title</Divider>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Typography>
                  {question &&
                    Object.keys(question).length !== 0 &&
                    question.title}
                  &nbsp;
                </Typography>
                <Typography color={difficultyColor}>
                  {question &&
                    Object.keys(question).length !== 0 &&
                    question.difficulty}
                </Typography>
              </Box>
              <Divider textAlign="left">Question</Divider>
              {question &&
                Object.keys(question).length !== 0 &&
                question.description}
              <Divider textAlign="left">Examples</Divider>
              {question &&
                Object.keys(question).length !== 0 &&
                Object.keys(question.example).map((ex) => {
                  return (
                    <>
                      <Typography>
                        Input: {question.example[ex].input}
                      </Typography>
                      <Typography>
                        Output: {question.example[ex].output}
                      </Typography>
                      <br />
                    </>
                  );
                })}
            </>
          }
          value={value}
          index={0}
          height={tabPanelHeight}
        />
        <TabPanel
          children={
            <TextField
            fullWidth
            multiline
            variant="filled"
            placeholder={"Write your notes here"}
            color={"secondary"}
            focused={true}
            InputProps={{
              disableUnderline: true,
              sx: {
                height: tabPanelHeight,
                maxHeight: tabPanelHeight,
                alignItems: "flex-start",
                overflow: "auto",
              },
            }}
            margin="none"
          />
          }
          value={value}
          index={1}
          height={tabPanelHeight}
        />
        <TabPanel
          children={output}
          value={value}
          index={2}
          height={tabPanelHeight}
        />
      </Box>
    </>
  );
}

export default BasicTab;
