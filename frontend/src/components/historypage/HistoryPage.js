import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import TabPanel from "../codingpage/TabPanel";

const HistoryPage = () => {
  let decideColor = "";
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const [tab, setTab] = useState(0);

  const title =
    location.state && location.state.title ? location.state.title : "No title";
  const timestamp =
    location.state && location.state.timestamp
      ? location.state.timestamp
      : "Time unknown";
  const interviewer =
    location.state && location.state.interviewer
      ? location.state.interviewer
      : "Interviwer unknown";
  const difficulty =
    location.state && location.state.difficulty
      ? location.state.difficulty
      : "Difficulty unknown";
  const code =
    location.state && location.state.code ? location.state.code : "No code";
  const question =
    location.state && location.state.question
      ? location.state.question
      : "No question";
  const interviewerNotes =
    location.state && location.state.interviewerNotes
      ? location.state.interviewerNotes
      : "No interviewer notes";
  const personalNotes =
    location.state && location.state.personalNotes
      ? location.state.personalNotes
      : "No personal notes";

  console.log(location.state);

  const onDashboardClick = () => {
    navigate("/dashboard");
  };

  const tabPanelHeight = "80vh";

  if (difficulty === "Easy") {
    decideColor = "green";
  } else if (difficulty === "Medium") {
    decideColor = "orange";
  } else if (difficulty === "Hard") {
    decideColor = "red";
  } else {
    decideColor = "white";
  }

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    if (!location.state) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  return (
    <>
      <Box
        className="mainHistoryPageBox"
        sx={{
          marginTop: "2%",
          padding: "0 10%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          className="leftHistoryPageBox"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "75%",
            height: "90vh",
            marginRight: "2%",
            backgroundColor: "#2a2e38",
          }}
        >
          <Box
            className="topBarHistoryPage"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "2%",
            }}
          >
            <Box
              className="historyPageQuestionInfo"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box
                className="historyPageCombinedInfo"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  className="historyPageTitleDifficulty"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant={"h5"}>{title}&nbsp;</Typography>
                  <Typography color={decideColor}>{difficulty}</Typography>
                </Box>
                <Typography>Interviewer: {interviewer}</Typography>
                <Typography>{timestamp}</Typography>
              </Box>
            </Box>
            <Box>
              <Button
                color="secondary"
                variant="contained"
                onClick={onDashboardClick}
              >
                Dashboard
              </Button>
            </Box>
          </Box>
          <Box
            className="historyPageCode"
            sx={{ paddingLeft: "2%", paddingRight: "2%", overflow: "auto" }}
          >
            <Divider textAlign="left" sx={{ marginBottom: "1%" }}>
              Code
            </Divider>
            <Typography>{code}</Typography>
          </Box>
        </Box>
        <Box
          className="historyPageInterviewerComments"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "25%",
            height: "90vh",
            borderColor: "divider",
            backgroundColor: "#2a2e38",
          }}
        >
          <Tabs
            value={tab}
            variant={"fullWidth"}
            onChange={handleTabChange}
            aria-label="basic tabs example"
            textColor={"secondary"}
            indicatorColor={"secondary"}
          >
            <Tab label="Question" wrapped {...a11yProps(0)} />
            <Tab label="Interviewer notes" wrapped {...a11yProps(1)} />
            <Tab label="Personal notes" wrapped {...a11yProps(1)} />
          </Tabs>

          <TabPanel
            children={
              <Typography
                style={{ wordWrap: "break-word" }}
                sx={{ marginTop: "5%", marginLeft: "2%", marginRight: "2%" }}
              >
                {question}
              </Typography>
            }
            value={tab}
            index={0}
            height={tabPanelHeight}
          />
          <TabPanel
            children={
              <Typography
                style={{ wordWrap: "break-word" }}
                sx={{ marginTop: "5%", marginLeft: "2%", marginRight: "2%" }}
              >
                {interviewerNotes}
              </Typography>
            }
            value={tab}
            index={1}
            height={tabPanelHeight}
          />
          <TabPanel
            children={
              <Typography
                style={{ wordWrap: "break-word" }}
                sx={{ marginTop: "5%", marginLeft: "2%", marginRight: "2%" }}
              >
                {personalNotes}
              </Typography>
            }
            value={tab}
            index={2}
            height={tabPanelHeight}
          />
        </Box>
      </Box>
    </>
  );
};

export default HistoryPage;
