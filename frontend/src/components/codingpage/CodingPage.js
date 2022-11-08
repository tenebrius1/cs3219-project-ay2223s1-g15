import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import BasicTab from './BasicTab';
import CodePad from './CodePad';
import VideoCall from '../video/VideoCall.js'
import { useNavigate } from 'react-router-dom';
import CodingLanguageSelector from './CodingLanguageSelector';
import RoomContext from '../../contexts/RoomContext';
import './codingpage.css';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CodingPage() {
  const [value, setValue] = useState(0);
  const [inCall, setInCall] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('python');
  const [output, setOutput] = useState('Output');
  const navigate = useNavigate();
  const { difficulty, client, tracks } = useContext(RoomContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEndClick = async () => {
    if(inCall){
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    }
    navigate('/dashboard', { replace: true });
  };

  const handleJoinCallClick = () => {
    setInCall(true);
  }

  return (
    <Box className='mainCodingPageBox'>
      <Box className='codingSpace'>
        <Box className='titleBar'>
          <CodingLanguageSelector
            currentLanguage={currentLanguage}
            setCurrentLanguage={setCurrentLanguage}
          />
          <Button onClick={handleEndClick} variant='outlined' color='error'>
            End Interview
          </Button>
        </Box>
        <CodePad currentLanguage={currentLanguage} setOutput={setOutput} />
      </Box>
      <Box className='adminSpace'>
        <BasicTab output={output} inCall={inCall}/>
        <Box display={'flex'} justifyContent={'flex-end'} marginTop={'1rem'}>
          {!inCall && <Button variant='outlined' color='secondary' onClick={handleJoinCallClick}>
            Join Call
          </Button>}
        </Box>
        {inCall && 
          <Box className='videoCall'>
            <VideoCall setInCall={setInCall} />
          </Box>}
      </Box>
    </Box>
  );
}

export default CodingPage;
