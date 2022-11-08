import { useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import BasicTab from "./BasicTab";
import CodePad from "./CodePad";
import { useNavigate } from "react-router-dom";
import CodingLanguageSelector from "./CodingLanguageSelector";
import SocketContext from "../../contexts/SocketContext";
import RoomContext from "../../contexts/RoomContext";
import "./codingpage.css";

import VideoCall from "../video/VideoCall";
import Video from "../video/Video";
import ConfirmationDialog from "../confirmationdialog/ConfirmationDialog";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CodingPage() {
  const [currentLanguage, setCurrentLanguage] = useState("python");
  const [output, setOutput] = useState(
    "No output to display"
  );

  const [isRequestToChange, setIsRequestToChange] = useState(false);
  const [hasOtherPartyLeft, setHasOtherPartyLeft] = useState(false);

  const [hasClickedEndInterview, setHasClickedEndInterview] = useState(false);

  const navigate = useNavigate();
  const { codingSocket } = useContext(SocketContext);
  const { roomId } = useContext(RoomContext);

  const handleEndClick = () => {
    setHasClickedEndInterview(true);
    console.log("interview ended");
  };

  const handleEndClickCancel = () => {
    setHasClickedEndInterview(false);
  };

  const handleEndClickConfirm = () => {
    navigate("/dashboard", { replace: true });
  };

  const handleRequestToChange = () => {
    setIsRequestToChange(true);
  };

  const handleRoleSwapDecline = () => {
    setIsRequestToChange(false);
  };

  const handleOtherPartyLeave = () => {
    setHasOtherPartyLeft(true);
  };

  const handleOtherPartyLeaveClose = () => {
    setHasOtherPartyLeft(false);
  };

  useEffect(() => {
    codingSocket.on("languageChanged", (language) => {
      console.log("languageChanged ", language);
      setCurrentLanguage(language);
    });
  }, [codingSocket]);

  useEffect(() => {
    if (!roomId) {
      navigate("/dashboard", { replace: true });
      return
    }
  }, []);

  return (
    <Box className="mainCodingPageBox">
      <Box className="codingSpace">
        <Box className="titleBar">
          <CodingLanguageSelector
            currentLanguage={currentLanguage}
            setCurrentLanguage={(language) => {
              setCurrentLanguage(language);
              codingSocket.emit("languageChanged", {
                language: language,
                roomId,
              });
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleRequestToChange}
          >
            For testing change roles dialog purposes
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOtherPartyLeave}
          >
            For testing informing other party has left dialog
          </Button>
          <Button onClick={handleEndClick} variant="outlined" color="error">
            End Interview
          </Button>
        </Box>
        <CodePad currentLanguage={currentLanguage} setOutput={setOutput} />
      </Box>
      <Box className="adminSpace">
        <BasicTab output={output} />
      </Box>
      <ConfirmationDialog
        className="requestToChangeButtonDialog"
        open={isRequestToChange}
        close={handleRoleSwapDecline}
        confirm={() => {}}
        title={"Other user has requested to swap roles"}
        body={"Do you want to swap?"}
        accept={"Accept"}
        decline={"Decline"}
      />
      <ConfirmationDialog
        className="hasOtherPartyLeftButtonDialog"
        open={hasOtherPartyLeft}
        close={handleOtherPartyLeaveClose}
        confirm={handleEndClickConfirm}
        title={"Other user has left the room"}
        body={"Do you want to leave?"}
        accept={"Accept"}
        decline={"Decline"}
      />
      <ConfirmationDialog
        className="endInterviewButtonDialog"
        open={hasClickedEndInterview}
        close={handleEndClickCancel}
        confirm={handleEndClickConfirm}
        title={"End interview"}
        body={"Are you sure you want to exit?"}
        accept={"Accept"}
        decline={"Decline"}
      />
    </Box>
  );
}

export default CodingPage;
