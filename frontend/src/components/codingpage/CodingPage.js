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

import './codingpage.css';

import VideoCall from '../video/VideoCall';
import Video from '../video/Video';
import ConfirmationDialog from '../confirmationdialog/ConfirmationDialog';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CodingPage() {
  const [currentLanguage, setCurrentLanguage] = useState('python');
  const [output, setOutput] = useState('No output to display');
  const [notes, setNotes] = useState('');
  const [hasOtherPartyLeft, setHasOtherPartyLeft] = useState(false);
  const [question, setQuestion] = useState(null);
  const [hasClickedEndInterview, setHasClickedEndInterview] = useState(false);
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const { codingSocket, roomSocket } = useContext(SocketContext);
  const { roomId, setRoomId, difficulty, setDifficulty, partner, setPartner } =
    useContext(RoomContext);
  const { role, setRole, user } = useContext(UserContext);
  const params = useParams();

  const handleEndClick = () => {
    setHasClickedEndInterview(true);
    console.log('interview ended');
  };

  const handleEndClickCancel = () => {
    setHasClickedEndInterview(false);
  };

  const handleEndInterview = async () => {
    roomSocket.emit('endInterview', { roomId, user, role });
    if (role === 'interviewee') {
      console.log('interviewee end');
      await addHistory(
        user,
        question.title,
        code,
        notes,
        question.description,
        difficulty,
        partner,
        role
      );
    }

    navigate('/dashboard', { replace: true });
  };

  const handleOtherPartyLeave = () => {
    setHasOtherPartyLeft(true);
  };

  const handleOtherPartyLeaveClose = () => {
    setHasOtherPartyLeft(false);
  };

  useEffect(() => {
    if (!user) return;
    if (!role) {
      roomSocket.emit('codingPageReconnect', { roomId: params.roomId, user });
    }
  }, [user, role, params]);

  useEffect(() => {
    codingSocket.on('languageChanged', (language) => {
      console.log('languageChanged ', language);
      setCurrentLanguage(language);
    });
    return () => codingSocket.off('langugageChanged');
  }, [codingSocket]);

  useEffect(() => {
    roomSocket.on('reconnectSuccess', ({ roomId, role, difficulty }) => {
      setRole(role);
      setRoomId(roomId);
      setDifficulty(difficulty);
      codingSocket.emit('reconnectSuccess', roomId);
    });

    roomSocket.on('reconnectFail', () => {
      console.log('reconnectFail');
      navigate('/dashboard', { replace: true });
    });

    roomSocket.on('partnerLeft', () => {
      handleOtherPartyLeave();
    });

    roomSocket.on('handshake', (partner) => {
      setPartner(partner);
    });

    return () => {
      roomSocket.off('reconnectSuccess');
      roomSocket.off('reconnectFail');
      roomSocket.off('partnerLeft');
      roomSocket.off('handshake');
    };
  }, [codingSocket, navigate, roomSocket, setDifficulty, setPartner, setRole, setRoomId]);

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
        />
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
