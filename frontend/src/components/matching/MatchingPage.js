import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';
import { useState, useEffect, useContext } from 'react';
import { COUNTDOWN_DURATION } from '../../constants';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import './matchingpage.css';
import RoomContext from '../../contexts/RoomContext';
import UserContext from '../../contexts/UserContext';
import SocketContext from '../../contexts/SocketContext';

function MatchingPage() {
  const [isMatchFail, setIsMatchFail] = useState(false);
  const [isMatchSuccess, setIsMatchSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0);
  const navigate = useNavigate();

  const { difficulty, setRoomId, setPartner } = useContext(RoomContext);
  const { user, setRole } = useContext(UserContext);
  const { matchingSocket, codingSocket, roomSocket } = useContext(SocketContext);

  //Send match event when countdown timer starts
  useEffect(() => {
    if (!difficulty || !user) {
      navigate('/dashboard', { replace: true }); // if access this screen directly rather than from dashboard
      return;
    }
    matchingSocket.emit('match', user, difficulty);
  }, [key]);

  useEffect(() => {
    if (!difficulty || !user) {
      navigate('/dashboard', { replace: true }); // if access this screen directly rather than from dashboard
      return;
    }
    matchingSocket.on('matchFail', () => {
      setIsMatchFail(true);
    });
    matchingSocket.on('matchSuccess', ({ roomId, role, partner }) => {
      setRole(role);
      setRoomId(roomId);
      setPartner(partner);
      setIsMatchSuccess(true);
      roomSocket.emit('matchSuccess', { roomId, difficulty, role, user });
      codingSocket.emit('matchSuccess', roomId);
      navigate(`/codingpage/${roomId}`, { replace: true });
    });
  }, [codingSocket, matchingSocket]);

  useEffect(() => {
    roomSocket.on('matchSuccess');
  });

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return (
        <Typography variant={'h5'} color={'#aaa'}>
          Do you want to retry?
        </Typography>
      );
    }
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant={'h3'}>{remainingTime}</Typography>
        <Typography variant={'h5'} color={'#aaa'}>
          seconds
        </Typography>
      </Box>
    );
  };

  const handleRetry = () => {
    setIsMatchFail(false);
    setKey((prevKey) => prevKey + 1);
  };

  const handleBack = () => {
    matchingSocket.emit('matchCancel', user);
    navigate('/dashboard', { replace: true });
  };

  return (
    <Box className='mainBox'>
      <Box className='statusBox'>
        {!isMatchFail ? (
          <Typography variant={'h4'}>Matching in progress...</Typography>
        ) : (
          <Typography variant={'h4'}>No match found :(</Typography>
        )}
      </Box>
      <CountdownCircleTimer
        key={key}
        isPlaying={isPlaying}
        duration={COUNTDOWN_DURATION}
        size={400}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[30, 20, 10, 0]}
        trailColor='#d6d6d6'
        onComplete={() => setIsMatchFail(true)}
      >
        {renderTime}
      </CountdownCircleTimer>
      <Grid container className='mainGrid' sx={{ marginTop: '2rem' }}>
        <Zoom in={true} sx={{ transitionDelay: '1500ms' }}>
          <Grid container item xs={3} justifyContent='center'>
            <Button variant={'outlined'} onClick={handleBack} color={'secondary'}>
              Cancel match
            </Button>
          </Grid>
        </Zoom>
        {isMatchFail && (
          <Zoom in={true} sx={{ transitionDelay: '1500ms' }}>
            <Grid container item xs={3} justifyContent='center'>
              <Button variant={'outlined'} onClick={handleRetry} color={'secondary'}>
                Retry
              </Button>
            </Grid>
          </Zoom>
        )}
      </Grid>
    </Box>
  );
}

export default MatchingPage;
