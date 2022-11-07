import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { githubDark } from '@uiw/codemirror-theme-github';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { historyField } from '@codemirror/commands';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import SocketContext from '../../contexts/SocketContext';
import RoomContext from '../../contexts/RoomContext';
import * as Automerge from 'automerge';

const stateFields = { history: historyField };

let doc = Automerge.init();

function CodePad({ currentLanguage, setOutput }) {
  const serializedState = localStorage.getItem('myEditorState');
  const [code, setCode] = useState('');
  const availableLanguages = {
    python: '70',
    java: '62',
    c: '50',
  };

  const { codingSocket } = useContext(SocketContext);
  const { roomId } = useContext(RoomContext);

  useEffect(() => {
    codingSocket.on('codeChanged', (value) => {
      // console.log('codeChanged', value);
      // setCode(value);
      const updated = new Uint8Array(value);
      let newDoc = Automerge.merge(doc, Automerge.load(updated));
      doc = newDoc;
      setCode(doc.text);
    });

    codingSocket.on('runCodeResults', (results) => {
      console.log('runCodeResults', results);
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
      codingSocket.emit('codeChanged', { value: binary, roomId: roomId });
      doc = newDoc;
    } catch (err) {
      console.log(err);
    }
  };

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
          if (viewUpdate.transactions[0].annotations.length > 1) {
            updateDocument(value);
          }
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
