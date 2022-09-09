import { useState } from "react";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { githubDark } from '@uiw/codemirror-theme-github';
import { Button, Box } from "@mui/material"
import { historyField } from '@codemirror/commands';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

const stateFields = { history: historyField };

function CodePad() {
    const serializedState = localStorage.getItem('myEditorState');
    const value = localStorage.getItem('myValue') || '';
    const [code, setCode] = useState(value);

    const submitCode = () => {
        axios
            .post("http://localhost:8000/api/user/python", { code })
            .then((res) => console.log(res));
    };

    return (
        <>
            <CodeMirror 
                value={value}
                theme={githubDark}
                height={"24rem"}
                extensions={[loadLanguage('python')]}
                initialState={
                    serializedState
                      ? {
                          json: JSON.parse(serializedState || ''),
                          fields: stateFields,
                        }
                      : undefined
                }
                onChange={(value, viewUpdate) => {
                    localStorage.setItem('myValue', value);
            
                    const state = viewUpdate.state.toJSON(stateFields);
                    localStorage.setItem('myEditorState', JSON.stringify(state));
                    setCode(value);
                }}
            />
            <Box display={"flex"} justifyContent={"flex-end"} marginTop={"1rem"}>
                <Button variant={"contained"} color={"success"} onClick={submitCode}>Run</Button>
            </Box>
        </>
    )
}

export default CodePad;
