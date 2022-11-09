import { useEffect, useState, useContext, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import TabPanel from './TabPanel';
import './codingpage.css';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { URL_QUESTION_SVC } from '../../configs';
import RoomContext from '../../contexts/RoomContext';
import UserContext from '../../contexts/UserContext';
import SocketContext from '../../contexts/SocketContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../confirmationdialog/ConfirmationDialog';
import Divider from '@mui/material/Divider';
import { addHistory } from '../../api/history';
import { generateRandomQuestion } from '../../api/question';

function BasicTab({ output, setNotes, question, setQuestion }) {
  const [value, setValue] = useState(0);
  const [isEndTurn, setIsEndTurn] = useState(false);
  const [isEndTurnConfirm, setIsEndTurnConfirm] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const { roomId, difficulty, setPartner, setDifficulty } = useContext(RoomContext);
  const { role, setRole, user } = useContext(UserContext);
  const { roomSocket } = useContext(SocketContext);
  const [difficultyColor, setDifficultyColor] = useState('');
  const tabPanelHeight = '75vh';
  const defaultQuestion = {
    title: 'test',
    difficulty: 'easy',
    description: '',
    example: {},
    constraint: {},
  };
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
    getQuestion(difficulty);
  }, []);
  useEffect(() => {
    roomSocket.on('receiveQuestion', (question) => {
      setQuestion(question);
      decideDifficultyColor();
    });
    return () => roomSocket.off('receiveQuestion');
  }, [question]);

  useEffect(() => {
    roomSocket.on('partnerReconnect', () => {
      roomSocket.emit('sendQuestion', { roomId, question });
    });
    return () => roomSocket.off('partnerReconnect');
  }, [roomId, question]);

  useEffect(() => {
    roomSocket.on('initialLoad', (partner) => {
      setPartner(partner);
      if (role !== 'interviewer') {
        if (!question) {
          roomSocket.emit('initialLoadAck', { roomId, isInitialLoad: true });
        } else {
          roomSocket.emit('initialLoadAck', { roomId, isInitialLoad: false });
        }
      }
    });
  }, [role, roomId]);

  const getQuestion = useCallback(async () => {
    await generateRandomQuestion(difficulty)
      .then((res) => {
        setQuestion(res);
        decideDifficultyColor();
        roomSocket.emit('sendQuestion', { roomId, question: res });
      })
      .catch((err) => console.log(err));
  }, [decideDifficultyColor, difficulty, roomId, roomSocket, setQuestion]);

  useEffect(() => {
    if (!roomId || !role) {
      return;
    }
    if (role === 'interviewer' && isInitialLoad && !question) {
      console.log('interivwer initial');
      getQuestion(difficulty);
      setIsInitialLoad(false);
    }
    console.log('basic tab line 124');
  }, [difficulty, roomId, role, isInitialLoad]);

  useEffect(() => {
    decideDifficultyColor();
  }, [decideDifficultyColor, question]);

  useEffect(() => {
    console.log('1');
    if (!roomId) {
      return;
    }

    if (!isInitialLoad && !question) {
      roomSocket.emit('initialLoad', { roomId, user });
      roomSocket.on('initialLoadAck', (isInitialLoad) => {
        console.log('isInitialLoad ', isInitialLoad);
        setIsInitialLoad(isInitialLoad);
      });
    }
  }, [roomId]);

  return (
    <>
      <Box className='adminArea'>
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
                Object.keys(question.example).map((ex) => {
                  return (
                    <>
                      <Typography>Input: {question.example[ex].input}</Typography>
                      <Typography>Output: {question.example[ex].output}</Typography>
                      <br />
                    </>
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
