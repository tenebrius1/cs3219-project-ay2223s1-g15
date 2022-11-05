import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { githubDark } from '@uiw/codemirror-theme-github';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { historyField } from '@codemirror/commands';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import SocketContext from '../../contexts/SocketContext';
import RoomContext from '../../contexts/RoomContext';

const stateFields = { history: historyField };

function CodePad({ currentLanguage, setOutput }) {
  const serializedState = localStorage.getItem('myEditorState');
  const [code, setCode] = useState('');
  const judgeURL = 'http://localhost:2358';
  const availableLanguages = {
    python: '70',
    java: '62',
    c: '50',
  };

  const { codingSocket } = useContext(SocketContext);
  const { roomId } = useContext(RoomContext);

  var reqBody = {
    source_code: `${code}`,
    language_id: `${availableLanguages[currentLanguage]}`,
    number_of_runs: null,
    stdin: 'Judge0',
    expected_output: null,
    cpu_time_limit: null,
    cpu_extra_time: null,
    wall_time_limit: null,
    memory_limit: null,
    stack_limit: null,
    max_processes_and_or_threads: null,
    enable_per_process_and_thread_time_limit: null,
    enable_per_process_and_thread_memory_limit: null,
    max_file_size: null,
    enable_network: null,
  };

  useEffect(() => {
    codingSocket.on('codeChanged', (value) => {
      console.log('codeChanged', value);
      setCode(value);
    });
  }, [codingSocket]);

  const submitCode = async () => {
    await axios
      .post(`${judgeURL}/submissions/?wait=true`, reqBody)
      .then((res) => {
        console.log(res);
        if (res.data.stdout === null) {
          setOutput(res.data.message);
        } else {
          setOutput(res.data.stdout);
        }
      })
      .catch((err) => console.log('err', err));
  };

  return (
    <>
      <CodeMirror
        value={code}
        theme={githubDark}
        height={'70vh'}
        extensions={[loadLanguage(currentLanguage)]}
        initialState={
          serializedState
            ? {
                json: JSON.parse(serializedState || ''),
                fields: stateFields,
              }
            : undefined
        }
        onChange={(value, viewUpdate) => {
          setCode(value);
          codingSocket.emit('codeChanged', {
            value: value,
            roomId: roomId,
          });
        }}
      />
      <Box display={'flex'} justifyContent={'flex-end'} marginTop={'1rem'}>
        <Button variant={'outlined'} color={'secondary'} onClick={submitCode}>
          Run code
        </Button>
      </Box>
    </>
  );
}

export default CodePad;
