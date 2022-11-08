import { useContext, useEffect, useState, useCallback, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { githubDark } from "@uiw/codemirror-theme-github";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { historyField } from "@codemirror/commands";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import SocketContext from "../../contexts/SocketContext";
import RoomContext from "../../contexts/RoomContext";
import * as Automerge from "automerge";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmationDialog from "../confirmationdialog/ConfirmationDialog";

const stateFields = { history: historyField };
const LIVE_URL =
  process.env.ENV === "PROD" ? process.env.LIVE_URL : "http://localhost";

let doc = Automerge.init();

function CodePad({ currentLanguage, setOutput }) {
  const serializedState = localStorage.getItem("myEditorState");
  const [code, setCode] = useState("");
  const [isEndTurn, setIsEndTurn] = useState(false);
  const [isEndTurnConfirm, setIsEndTurnConfirm] = useState(false);
  const availableLanguages = {
    python: "70",
    java: "62",
    c: "50",
  };

  const { codingSocket } = useContext(SocketContext);
  const { roomId } = useContext(RoomContext);
  const role = "Interviewer";

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
    codingSocket.on("codeChanged", (value) => {
      // console.log('codeChanged', value);
      // setCode(value);
      const updated = new Uint8Array(value);
      let newDoc = Automerge.merge(doc, Automerge.load(updated));
      doc = newDoc;
      setCode(doc.text);
    });

    codingSocket.on("runCodeResults", (results) => {
      console.log("runCodeResults", results);
      setOutput(results);
    });
  }, [codingSocket]);

  const updateDocument = (code) => {
    try {
      let newDoc = Automerge.change(doc, (doc) => {
        if (!doc.text) doc.text = code;
        doc.text = code;
      });

      let binary = Automerge.save(newDoc);
      codingSocket.emit("codeChanged", { value: binary, roomId: roomId });
      doc = newDoc;
    } catch (err) {
      console.log(err);
    }
  };

  const submitCode = () => {
    codingSocket.emit("runCode", {
      code: code,
      languageId: availableLanguages[currentLanguage],
      roomId: roomId,
    });
  };

  return (
    <>
      <CodeMirror
        value={code}
        theme={githubDark}
        height={"70vh"}
        extensions={[loadLanguage(currentLanguage)]}
        initialState={
          serializedState
            ? {
                json: JSON.parse(serializedState || ""),
                fields: stateFields,
              }
            : undefined
        }
        onChange={(value, viewUpdate) => {
          setCode(value);
          if (viewUpdate.transactions[0].annotations.length > 1) {
            updateDocument(value);
          }
        }}
      />
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginTop={"1rem"}
      >
        <Box className="endTurnBox">
        {isEndTurnConfirm ? (
          <>
            {/* <Button
              variant="outlined"
              color="error"
              onClick={handleEndTurnConfirmCancel}
              sx={{ marginRight: "2%"}}
            >
              Cancel
            </Button> */}
              <CircularProgress
                size={"1rem"}
                color="inherit"
                sx={{ marginRight: "2%" }}
              />
              <Typography>Swapping roles...</Typography>
          </>
        ) : (
          <>
            <Button variant="outlined" color="error" sx={{marginRight: "2%"}} onClick={handleEndTurn}>
              Swap roles
            </Button>
            <Typography>You are the: {role}</Typography>
          </>
        )}
      </Box>
      <ConfirmationDialog
        className="endTurnButtonDialog"
        open={isEndTurn}
        close={handleEndTurnCancel}
        confirm={handleEndTurnConfirm}
        title={"End turn"}
        body={"Are you sure you want to end your turn?"}
        accept={"Accept"}
        decline={"Decline"}
      />
        <Button variant={"contained"} color={"secondary"} onClick={submitCode}>
          Run code
        </Button>
      </Box>
    </>
  );
}

export default CodePad;
