import { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import BasicTab from './BasicTab';
import CodePad from './CodePad';
import { useNavigate, useParams } from 'react-router-dom';
import CodingLanguageSelector from './CodingLanguageSelector';
import SocketContext from '../../contexts/SocketContext';
import RoomContext from '../../contexts/RoomContext';
import UserContext from '../../contexts/UserContext';
import { addHistory } from '../../api/history';
import ConfirmationDialog from '../confirmationdialog/ConfirmationDialog';
import VideoCall from '../video/VideoCall.js';
import './codingpage.css';

function CodingPage() {
  const [currentLanguage, setCurrentLanguage] = useState('python');
  const [output, setOutput] = useState('No output to display');
  const [notes, setNotes] = useState('');
  const [inCall, setInCall] = useState(false);
  const [hasOtherPartyLeft, setHasOtherPartyLeft] = useState(false);
  const [question, setQuestion] = useState(null);
  const [hasClickedEndInterview, setHasClickedEndInterview] = useState(false);
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const { codingSocket, roomSocket } = useContext(SocketContext);
  const { roomId, setRoomId, difficulty, setDifficulty, partner, client, tracks } =
    useContext(RoomContext);
  const { role, setRole, user } = useContext(UserContext);
  const params = useParams();

  const handleEndClick = async () => {
    setHasClickedEndInterview(true);
  };

  const handleEndClickCancel = () => {
    setHasClickedEndInterview(false);
  };

  const handleEndInterview = async () => {
    roomSocket.emit('endInterview', { roomId, user, role });
    if (role === 'interviewee') {
      await addHistory(
        user,
        question.title,
        code,
        notes,
        question.description,
        difficulty
      );
    }
    if (inCall) {
      await client.leave();
      client.removeAllListeners();
      tracks[0].close();
      tracks[1].close();
    }
    navigate('/dashboard', { replace: true });
  };

  const handleOtherPartyLeave = () => {
    setHasOtherPartyLeft(true);
  };

  const handleOtherPartyLeaveClose = () => {
    setHasOtherPartyLeft(false);
  };

  const handleJoinCallClick = () => {
    setInCall(true);
  };

  useEffect(() => {
    if (!roomId || !difficulty) {
      navigate('/dashboard', { replace: true });
    }
  });

  useEffect(() => {
    codingSocket.on('languageChanged', (language) => {
      setCurrentLanguage(language);
    });
    return () => codingSocket.off('langugageChanged');
  }, [codingSocket]);

  useEffect(() => {
    roomSocket.on('partnerLeft', () => {
      handleOtherPartyLeave();
    });

    return () => {
      roomSocket.off('partnerLeft');
      roomSocket.off('handshake');
    };
  }, [codingSocket, navigate, roomSocket, setDifficulty, setRole, setRoomId]);

  return (
    <Box className='mainCodingPageBox'>
      <Box className='codingSpace'>
        <Box className='titleBar'>
          <CodingLanguageSelector
            currentLanguage={currentLanguage}
            setCurrentLanguage={(language) => {
              setCurrentLanguage(language);
              codingSocket.emit('languageChanged', {
                language: language,
                roomId,
              });
            }}
          />
          <Button onClick={handleEndClick} variant='outlined' color='error'>
            End Interview
          </Button>
        </Box>
        <CodePad
          currentLanguage={currentLanguage}
          setOutput={setOutput}
          notes={notes}
          question={question}
          setQuestion={setQuestion}
          code={code}
          setCode={setCode}
        />
      </Box>
      <Box className='adminSpace'>
        <BasicTab
          key={'1'}
          output={output}
          setNotes={setNotes}
          question={question}
          setQuestion={setQuestion}
          inCall={inCall}
        />
        <Box display={'flex'} justifyContent={'flex-end'} marginTop={'1rem'}>
          {!inCall && (
            <Button variant='outlined' color='secondary' onClick={handleJoinCallClick}>
              Join Call
            </Button>
          )}
        </Box>
        {inCall && (
          <Box className='videoCall'>
            <VideoCall setInCall={setInCall} />
          </Box>
        )}
      </Box>
      <ConfirmationDialog
        className='hasOtherPartyLeftButtonDialog'
        open={hasOtherPartyLeft}
        close={handleOtherPartyLeaveClose}
        confirm={handleEndInterview}
        title={'Other user has left the room'}
        body={'Do you want to leave?'}
        accept={'Accept'}
        decline={'Decline'}
      />
      <ConfirmationDialog
        className='endInterviewButtonDialog'
        open={hasClickedEndInterview}
        close={handleEndClickCancel}
        confirm={handleEndInterview}
        title={'End interview'}
        body={'Are you sure you want to exit?'}
        accept={'Accept'}
        decline={'Decline'}
      />
    </Box>
  );
}

export default CodingPage;
