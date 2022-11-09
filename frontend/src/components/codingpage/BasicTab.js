import { useEffect, useState, useContext, useCallback } from 'react';
import Box from '@mui/material/Box';

import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import TabPanel from './TabPanel';
import './codingpage.css';
import Typography from '@mui/material/Typography';

import { URL_QUESTION_SVC } from '../../configs';
import RoomContext from '../../contexts/RoomContext';
import UserContext from '../../contexts/UserContext';
import SocketContext from '../../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../confirmationdialog/ConfirmationDialog';
import Divider from '@mui/material/Divider';
import { addHistory } from '../../api/history';
import { generateRandomQuestion } from '../../api/question';

function BasicTab({ output, setNotes, question, setQuestion, inCall }) {
  const [value, setValue] = useState(0);
  const [tabPanelHeight, setTabPanelHeight] = useState('80vh');

  useEffect(() => {
    console.log(inCall);
    if (inCall) {
      setTabPanelHeight('60vh');
    } else {
      setTabPanelHeight('80vh');
    }
  }, [inCall]);
  const [isEndTurn, setIsEndTurn] = useState(false);
  const [isEndTurnConfirm, setIsEndTurnConfirm] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const { roomId, difficulty, setPartner, setDifficulty } = useContext(RoomContext);
  const { role, setRole, user } = useContext(UserContext);
  const { roomSocket } = useContext(SocketContext);
  const [isLoading, setIsLoading] = useState(true);
  const [difficultyColor, setDifficultyColor] = useState('');
  const getRandomQuestionError = 'Sorry but question could not be loaded at this time!';

  const navigate = useNavigate();

  const decideDifficultyColor = useCallback(() => {
    if (difficulty === 'Easy') {
      setDifficultyColor('green');
    } else if (difficulty === 'Medium') {
      setDifficultyColor('orange');
    } else if (difficulty === 'Hard') {
      setDifficultyColor('red');
    } else {
      setDifficultyColor('white');
    }
  }, [difficulty]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    roomSocket.on('receiveQuestion', (question) => {
      setQuestion(question);
      setIsLoading(false);
      decideDifficultyColor();
    });
    return () => roomSocket.off('receiveQuestion');
  }, [question]);

  const getQuestion = useCallback(async () => {
    await generateRandomQuestion(difficulty)
      .then((res) => {
        setQuestion(res);
        decideDifficultyColor();
        roomSocket.emit('sendQuestion', { roomId, question: res });
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, [decideDifficultyColor, difficulty, roomId, roomSocket, setQuestion]);

  useEffect(() => {
    if (!roomId || !difficulty || !role) {
      return;
    }
    if (role === 'interviewer' && !question) {
      getQuestion(difficulty);
    }
  }, [difficulty, roomId, role, isInitialLoad]);

  useEffect(() => {
    decideDifficultyColor();
  }, [decideDifficultyColor, question]);

  return (
    <>
      <Box className='adminArea'>
        <>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
          >
            <CircularProgress color='inherit' />
          </Backdrop>
        </>
        <Box sx={{ borderColor: 'divider' }}>
          <Tabs
            value={value}
            variant={'fullWidth'}
            onChange={handleChange}
            aria-label='basic tabs example'
            textColor={'secondary'}
            indicatorColor={'secondary'}
          >
            <Tab key={'1'} label='Question' {...a11yProps(0)} />
            <Tab key={'2'} label='Notes' {...a11yProps(1)} />
            <Tab key={'3'} label='Output' {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel
          children={
            <>
              <Divider textAlign='left'>Title</Divider>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography>
                  {question && question.title}
                  &nbsp;
                </Typography>
                <Typography color={difficultyColor}>
                  {question && question.difficulty}
                </Typography>
              </Box>
              <Divider textAlign='left'>Question</Divider>
              {question && question.description}
              <Divider textAlign='left'>Examples</Divider>
              {question &&
                Object.keys(question.example).map((ex, index) => {
                  return (
                    <Box key={index}>
                      <Typography>Example {index + 1}:</Typography>
                      <Typography>Input: {question.example[ex].input}</Typography>
                      <Typography>Output: {question.example[ex].output}</Typography>
                      <br />
                    </Box>
                  );
                })}
              <Divider textAlign='left'>Constraints</Divider>
              {question &&
                Object.keys(question).length !== 0 &&
                Object.keys(question.constraint).map((constraints, index) => {
                  return (
                    <Box key={index}>
                      <Typography>Constraint {index + 1}:</Typography>
                      <Typography>{question.constraint[constraints]}</Typography>
                      <br />
                    </Box>
                  );
                })}
            </>
          }
          value={value}
          index={0}
          height={tabPanelHeight}
        />
        <TabPanel
          children={
            <TextField
              fullWidth
              multiline
              variant='filled'
              placeholder={'Write your notes here'}
              color={'secondary'}
              focused={true}
              onChange={(e) => setNotes(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: {
                  height: tabPanelHeight,
                  maxHeight: tabPanelHeight,
                  alignItems: 'flex-start',
                  overflow: 'auto',
                },
              }}
              margin='none'
            />
          }
          value={value}
          index={1}
          height={tabPanelHeight}
        />
        <TabPanel children={output} value={value} index={2} height={tabPanelHeight} />
      </Box>
    </>
  );
}

export default BasicTab;
