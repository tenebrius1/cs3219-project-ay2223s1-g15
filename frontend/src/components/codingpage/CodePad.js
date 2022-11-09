import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { githubDark } from '@uiw/codemirror-theme-github';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { historyField } from '@codemirror/commands';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import SocketContext from '../../contexts/SocketContext';
import RoomContext from '../../contexts/RoomContext';
import UserContext from '../../contexts/UserContext';
import * as Automerge from 'automerge';
import CircularProgress from '@mui/material/CircularProgress';
import ConfirmationDialog from '../confirmationdialog/ConfirmationDialog';
import { addHistory } from '../../api/history';
import { generateRandomQuestion } from '../../api/question';

const stateFields = { history: historyField };
const LIVE_URL = process.env.ENV === 'PROD' ? process.env.LIVE_URL : 'http://localhost';

let doc = Automerge.init();

function CodePad({
  currentLanguage,
  setOutput,
  notes,
  question,
  setQuestion,
  code,
  setCode,
}) {
  const serializedState = localStorage.getItem('myEditorState');
  const [isEndTurn, setIsEndTurn] = useState(false);
  const [isEndTurnConfirm, setIsEndTurnConfirm] = useState(false);
  const [isRequestToChange, setIsRequestToChange] = useState(false);
  const [allowSwap, setAllowSwap] = useState(true);

  const availableLanguages = {
    python: '70',
    java: '62',
    c: '50',
  };

  const { codingSocket, roomSocket } = useContext(SocketContext);
  const { roomId, difficulty, partner } = useContext(RoomContext);
  const { user, role, setRole } = useContext(UserContext);

  const updateDocument = useCallback(
    (code) => {
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
    },
    [codingSocket, roomId]
  );

  useEffect(() => {
    roomSocket.on('requestSwap', () => {
      setIsRequestToChange(true);
    });

    roomSocket.on('roleSwap', async (args) => {
      const newRole = args.role;
      console.log(newRole);
      if (!question) {
        return;
      }
      if (role === 'interviewee') {
        addHistory(
          user,
          question.title,
          code,
          notes,
          question.description,
          difficulty,
          partner,
          role
        );
        await generateRandomQuestion(difficulty)
          .then((res) => {
            setQuestion(res);
            roomSocket.emit('sendQuestion', {
              roomId,
              question: res,
            });
          })
          .catch((err) => console.log(err));
      }
      setRole(newRole);
      setCode('');
      updateDocument('');
      setIsEndTurnConfirm(false);
      setAllowSwap(false);
    });
    return () => {
      roomSocket.off('requestSwap');
      roomSocket.off('roleSwap');
    };
  }, [
    isRequestToChange,
    roomSocket,
    setRole,
    user,
    question,
    code,
    role,
    notes,
    difficulty,
    partner,
    setCode,
    updateDocument,
    setQuestion,
    roomId,
  ]);

  const handleEndTurn = () => {
    // actually end turn
    setIsEndTurn(true);
  };

  const handleEndTurnConfirm = () => {
    // open confirmation modal
    setIsEndTurnConfirm(true);
    setIsEndTurn(false);
    roomSocket.emit('requestSwap', { roomId, user });
  };

  const handleRoleSwapDecline = () => {
    setIsRequestToChange(false);
    roomSocket.emit('rejectRoleSwap', roomId);
  };

  useEffect(() => {
    codingSocket.on('codeChanged', (value) => {
      const updated = new Uint8Array(value);
      let newDoc = Automerge.merge(doc, Automerge.load(updated));
      doc = newDoc;
      setCode(doc.text);
    });

    codingSocket.on('runCodeResults', (results) => {
      setOutput(results);
    });

    return () => {
      codingSocket.off('codeChanged');
      codingSocket.off('runCodeResults');
    };
  }, [codingSocket]);

  useEffect(() => {
    roomSocket.on('rejectRoleSwap', () => {
      setIsEndTurnConfirm(false);
    });
  });

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
        height={'80vh'}
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
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        marginTop={'1rem'}
      >
        <Box className='endTurnBox'>
          {allowSwap
            ? () => {
                isEndTurnConfirm ? (
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
                      size={'1rem'}
                      color='inherit'
                      sx={{ marginRight: '2%' }}
                    />
                    <Typography>Swapping roles...</Typography>
                  </>
                ) : (
                  <>
                    <Button
                      variant='outlined'
                      color='error'
                      sx={{ marginRight: '2%' }}
                      onClick={handleEndTurn}
                    >
                      Swap roles
                    </Button>
                    <Typography>You are the {role}</Typography>
                  </>
                );
              }
            : () => <></>}
        </Box>
        <ConfirmationDialog
          className='endTurnButtonDialog'
          open={isEndTurn}
          close={() => setIsEndTurn(false)}
          confirm={handleEndTurnConfirm}
          title={'Swap roles'}
          body={'Are you sure you want to swap roles?'}
          accept={'Accept'}
          decline={'Decline'}
        />
        <Button variant={'contained'} color={'secondary'} onClick={submitCode}>
          Run code
        </Button>
      </Box>
      <ConfirmationDialog
        className='requestToChangeButtonDialog'
        open={isRequestToChange}
        close={handleRoleSwapDecline}
        confirm={async () => {
          console.log(role);
          roomSocket.emit('roleSwap', { roomId, user });
          if (role === 'interviewer') {
            setRole('interviewee');
          } else {
            setRole('interviewer');
          }
          setIsRequestToChange(false);
          if (role === 'interviewee') {
            addHistory(
              user,
              question.title,
              code,
              notes,
              question.description,
              difficulty,
              partner,
              role
            );
            await generateRandomQuestion(difficulty)
              .then((res) => {
                setQuestion(res);
                roomSocket.emit('sendQuestion', {
                  roomId,
                  question: res,
                });
              })
              .catch((err) => console.log(err));
          }

          setCode('');
          updateDocument('');
        }}
        title={'Other user has requested to swap roles'}
        body={'Do you want to swap?'}
        accept={'Accept'}
        decline={'Decline'}
      />
    </>
  );
}

export default CodePad;
