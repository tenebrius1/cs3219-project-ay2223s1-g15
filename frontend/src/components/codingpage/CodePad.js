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

const stateFields = { history: historyField };
const LIVE_URL =
  process.env.ENV === "PROD" ? process.env.LIVE_URL : "http://localhost";

let doc = Automerge.init();

function CodePad({ currentLanguage, setOutput }) {
  const serializedState = localStorage.getItem("myEditorState");
  const [code, setCode] = useState("");
  const availableLanguages = {
    python: "70",
    java: "62",
    c: "50",
  };

  const { codingSocket } = useContext(SocketContext);
  const { roomId } = useContext(RoomContext);
  const role = "Interviewer";

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
        <Typography>You are the: {role}</Typography>
        <Button variant={"contained"} color={"secondary"} onClick={submitCode}>
          Run code
        </Button>
      </Box>
    </>
  );
}

export default CodePad;
