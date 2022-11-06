import { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import BasicTab from './BasicTab';
import CodePad from './CodePad';
import { useNavigate } from 'react-router-dom';
import CodingLanguageSelector from './CodingLanguageSelector';
import SocketContext from '../../contexts/SocketContext';
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
  const [currentLanguage, setCurrentLanguage] = useState('python');
  const [output, setOutput] = useState('Output');
  const navigate = useNavigate();
  const { codingSocket } = useContext(SocketContext);
  const { roomId } = useContext(RoomContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEndClick = () => {
    navigate('/dashboard', { replace: true });
  };

  useEffect(() => {
    codingSocket.on('languageChanged', (language) => {
      console.log('languageChanged ', language);
      setCurrentLanguage(language);
    });
  }, [codingSocket]);

  return (
    <Box className='mainCodingPageBox'>
      <Box className='codingSpace'>
        <Box className='titleBar'>
          <CodingLanguageSelector
            currentLanguage={currentLanguage}
            setCurrentLanguage={(language) => {
              setCurrentLanguage(language);
              codingSocket.emit('languageChanged', { language: language, roomId });
            }}
          />
          <Button onClick={handleEndClick} variant='outlined' color='error'>
            End Interview
          </Button>
        </Box>
        <CodePad currentLanguage={currentLanguage} setOutput={setOutput} />
      </Box>
      <Box className='adminSpace'>
        <BasicTab output={output} />
      </Box>
    </Box>
  );
}

export default CodingPage;
