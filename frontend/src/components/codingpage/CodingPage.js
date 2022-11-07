import { useState } from "react";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import BasicTab from "./BasicTab";
import CodePad from "./CodePad";
import { useNavigate } from "react-router-dom";
import CodingLanguageSelector from "./CodingLanguageSelector";
import "./codingpage.css";
import Typography from "@mui/material/Typography";
import VideoCall from "../video/VideoCall";
import Video from "../video/Video";

function CodingPage() {
  const [currentLanguage, setCurrentLanguage] = useState("python");
  const [output, setOutput] = useState(
    "Output Irure enim anim amet sit amet veniam aliqua. Nostrud proident commodo est nostrud. Amet deserunt cillum mollit aute culpa est esse voluptate anim laborum dolore. Eu ea irure amet sint enim est id sunt. Dolor quis reprehenderit ipsum aliqua proident duis. Incididunt in esse Lorem cupidatat sunt anim adipisicing. Eu dolor aliqua Lorem laboris eiusmod reprehenderit commodo mollit occaecat ad enim. Eiusmod aute do do quis irure culpa labore in voluptate incididunt consequat proident pariatur in. Magna sint officia aute anim nisi est in consectetur anim ipsum cillum. Consequat reprehenderit amet sunt occaecat ipsum fugiat veniam reprehenderit ut. Anim laborum exercitation exercitation nisi ut sit nulla sint. Commodo veniam incididunt irure voluptate in eiusmod laboris excepteur quis culpa ullamco. Elit aliquip aliqua tempor amet excepteur ad labore et eu consequat aute sunt id. Enim ex quis cillum aute qui. Minim dolore cupidatat ad magna proident. Eu tempor non ea ullamco velit. Officia veniam occaecat Lorem adipisicing aliqua velit ut excepteur anim sint aute enim reprehenderit. Non sunt id velit elit esse aliqua minim. Sint sunt sint sint magna cillum est eiusmod. Eu nulla sunt officia voluptate Lorem exercitation reprehenderit id officia enim velit consectetur. Occaecat nisi qui ea anim. Laborum voluptate irure id consectetur tempor qui. Minim sit et eiusmod est laboris consequat ad. Aute dolor excepteur sit commodo esse. Tempor veniam labore enim sit aute sit minim dolor adipisicing nulla nulla amet fugiat."
  );
  const navigate = useNavigate();
  const [isRequestToChange, setIsRequestToChange] = useState(false);
  const [hasOtherPartyLeft, setHasOtherPartyLeft] = useState(false);

  const handleEndClick = () => {
    navigate("/dashboard", { replace: true });
  };

  const handleRequestToChangeClose = () => {
    setIsRequestToChange(false);
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

  return (
    <Box className="mainCodingPageBox">
      <Box className="codingSpace">
        <Box className="titleBar">
          <CodingLanguageSelector
            currentLanguage={currentLanguage}
            setCurrentLanguage={setCurrentLanguage}
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
      <Dialog
        open={isRequestToChange}
        onClose={handleRequestToChangeClose}
        fullWidth
        scroll={"paper"}
        PaperProps={{
          sx: {
            height: "auto",
            maxHeight: "90%",
          },
        }}
      >
        <DialogTitle>
          Other user has requested to swap roles
          {handleRequestToChangeClose && (
            <IconButton
              onClick={handleRequestToChangeClose}
              sx={{
                position: "absolute",
                right: 12,
                top: 12,
                color: "#D8DEE9",
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography>Do you want to swap?</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                marginTop: "2%",
              }}
            >
              <Button
                color="error"
                variant="outlined"
                onClick={handleRoleSwapDecline}
              >
                Decline
              </Button>
              <Button color="secondary" variant="contained">
                Accept
              </Button>
            </Box>
          </Box>
        </DialogTitle>
      </Dialog>
      <Dialog
        open={hasOtherPartyLeft}
        onClose={handleOtherPartyLeaveClose}
        fullWidth
        scroll={"paper"}
        PaperProps={{
          sx: {
            height: "auto",
            maxHeight: "90%",
          },
        }}
      >
        <DialogTitle>
          Other user has left the room
          {handleOtherPartyLeaveClose && (
            <IconButton
              onClick={handleOtherPartyLeaveClose}
              sx={{
                position: "absolute",
                right: 12,
                top: 12,
                color: "#D8DEE9",
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography>Do you want to leave?</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                marginTop: "2%",
              }}
            >
              <Button
                color="error"
                variant="outlined"
                onClick={handleOtherPartyLeaveClose}
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={handleEndClick}
              >
                Dashboard
              </Button>
            </Box>
          </Box>
        </DialogTitle>
      </Dialog>
    </Box>
  );
}

export default CodingPage;
