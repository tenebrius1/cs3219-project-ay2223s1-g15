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
    "Output Irure enim anim amet sit amet veniam aliqua. Nostrud proident commodo est nostrud. Amet deserunt cillum mollit aute culpa est esse voluptate anim laborum dolore. Eu ea irure amet sint enim est id sunt. Dolor quis reprehenderit ipsum aliqua proident duis. Incididunt in esse Lorem cupidatat sunt anim adipisicing. Eu dolor aliqua Lorem laboris eiusmod reprehenderit commodo mollit occaecat ad enim. Eiusmod aute do do quis irure culpa labore in voluptate incididunt consequat proident pariatur in. Magna sint officia aute anim nisi est in consectetur anim ipsum cillum. Consequat reprehenderit amet sunt occaecat ipsum fugiat veniam reprehenderit ut. Anim laborum exercitation exercitation nisi ut sit nulla sint. Commodo veniam incididunt irure voluptate in eiusmod laboris excepteur quis culpa ullamco. Elit aliquip aliqua tempor amet excepteur ad labore et eu consequat aute sunt id. Enim ex quis cillum aute qui. Minim dolore cupidatat ad magna proident. Eu tempor non ea ullamco velit. Officia veniam occaecat Lorem adipisicing aliqua velit ut excepteur anim sint aute enim reprehenderit. Non sunt id velit elit esse aliqua minim. Sint sunt sint sint magna cillum est eiusmod. Eu nulla sunt officia voluptate Lorem exercitation reprehenderit id officia enim velit consectetur. Occaecat nisi qui ea anim. Laborum voluptate irure id consectetur tempor qui. Minim sit et eiusmod est laboris consequat ad. Aute dolor excepteur sit commodo esse. Tempor veniam labore enim sit aute sit minim dolor adipisicing nulla nulla amet fugiat."
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
