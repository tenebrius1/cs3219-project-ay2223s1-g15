import { Box, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import './dashboard.css';
import { useState, useContext } from 'react';
import CustomAvatar from './CustomAvatar';
import RoomContext from '../../contexts/RoomContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { STATUS_CODE_BAD_REQ, STATUS_CODE_CREATED } from '../../constants';

function Dashboard() {
  const [buttonToggleEasy, setButtonToggleEasy] = useState(false);
  const [buttonToggleMedium, setButtonToggleMedium] = useState(false);
  const [buttonToggleHard, setButtonToggleHard] = useState(false);

  const navigate = useNavigate();
  const { difficulty, setDifficulty } = useContext(RoomContext);
  const { user } = useAuth();

  const startMatch = async () => {
    console.log('user', user);
    console.log('difficulty', difficulty);
    navigate('/matching');
  };

  const toggleButtonEasy = (event) => {
    event.preventDefault();
    if (buttonToggleMedium) {
      setButtonToggleMedium(false);
    }
    if (buttonToggleHard) {
      setButtonToggleHard(false);
    }
    if (buttonToggleEasy) {
      setDifficulty('');
    } else {
      setDifficulty('Easy');
    }
    setButtonToggleEasy(!buttonToggleEasy);
  };

  const toggleButtonMedium = (event) => {
    event.preventDefault();
    if (buttonToggleEasy) {
      setButtonToggleEasy(false);
    }
    if (buttonToggleHard) {
      setButtonToggleHard(false);
    }
    if (buttonToggleMedium) {
      setDifficulty('');
    } else {
      setDifficulty('Medium');
    }
    setButtonToggleMedium(!buttonToggleMedium);
  };

  const toggleButtonHard = (event) => {
    event.preventDefault();
    if (buttonToggleEasy) {
      setButtonToggleEasy(false);
    }
    if (buttonToggleMedium) {
      setButtonToggleMedium(false);
    }
    if (buttonToggleHard) {
      setDifficulty('');
    } else {
      setDifficulty('Hard');
    }
    setButtonToggleHard(!buttonToggleHard);
  };

  const handleClickEasy = () => (buttonToggleEasy ? 'contained' : 'outlined');
  const handleClickMedium = () => (buttonToggleMedium ? 'contained' : 'outlined');
  const handleClickHard = () => (buttonToggleHard ? 'contained' : 'outlined');

  return (
    <Box className='mainDashboardBox'>
      <Box className='topBar'>
        <Typography component={'h3'} variant={'h5'}>
          PeerPrep
        </Typography>
        <CustomAvatar />
      </Box>
      <Box className='mainContent'>
        <Box className='leftBox'>Practice History</Box>
        <Box className='rightBox'>
          <Typography className='difficultyButton' component={'h3'} variant={'h5'}>
            Difficulty
          </Typography>
          <Button
            className='difficultyButton'
            color={'success'}
            variant={handleClickEasy()}
            onClick={toggleButtonEasy}
          >
            Easy
          </Button>
          <Button
            className='difficultyButton'
            color={'warning'}
            variant={handleClickMedium()}
            onClick={toggleButtonMedium}
          >
            Medium
          </Button>
          <Button
            className='difficultyButton'
            color={'error'}
            variant={handleClickHard()}
            onClick={toggleButtonHard}
          >
            Hard
          </Button>
          {buttonToggleEasy || buttonToggleMedium || buttonToggleHard ? (
            <Button
              className='queueUpButton'
              color={'info'}
              variant={'contained'}
              onClick={startMatch}
            >
              Practise
            </Button>
          ) : (
            <Button className='queueUpButton' color={'info'} variant={'contained'}>
              Practise
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
