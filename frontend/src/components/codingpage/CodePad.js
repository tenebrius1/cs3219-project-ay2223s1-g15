import { useContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    codingSocket.on('codeChanged', (value) => {
      console.log('codeChanged ', value);
      setCode(value);
    });

    codingSocket.on('runCodeResults', (results) => {
      console.log('runCodeResults', results);
      setOutput(results);
    });
  }, [codingSocket]);

  const submitCode = () => {
    codingSocket.emit('runCode', {
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
