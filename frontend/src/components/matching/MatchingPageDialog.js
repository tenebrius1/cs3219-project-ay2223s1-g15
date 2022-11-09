import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';
import { useState, useEffect, useContext } from 'react';
import { COUNTDOWN_DURATION } from '../../constants';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import './matchingpage.css';
import RoomContext from '../../contexts/RoomContext';
import UserContext from '../../contexts/UserContext';
import SocketContext from '../../contexts/SocketContext';
import { DialogTitle } from '@mui/material';

function MatchingPageDialog({ open, close, setIsStartMatch }) {
  const [isMatchFail, setIsMatchFail] = useState(false);
  const [isMatchSuccess, setIsMatchSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0);
  const navigate = useNavigate();

  const { difficulty, setRoomId } = useContext(RoomContext);
  const { user } = useContext(UserContext);
  const { matchingSocket, codingSocket } = useContext(SocketContext);

  useEffect(() => {
    setIsMatchFail(false);
    // if (!open) {
    //   setIsPlaying(false);
    // }
    // setKey(key => key + 1)
  }, [open]);

  //Send match event when countdown timer starts
  useEffect(() => {
    if (open && user && difficulty) {
      matchingSocket.emit('match', user, difficulty);
    }
  }, [key, open]);

  useEffect(() => {
    if (open && user && difficulty) {
      matchingSocket.on('matchFail', () => {
        setIsMatchFail(true);
      });
      matchingSocket.on('matchSuccess', (roomId) => {
        setIsMatchSuccess(true);
        codingSocket.emit('connectedToRoom', roomId);
        setRoomId(roomId);
        navigate('/codingpage', { replace: true });
      });
    }
  }, [codingSocket, matchingSocket, open]);

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
    // navigate("/dashboard", { replace: true });
    setIsStartMatch(false);
  };

  return (
    <Dialog open={open} onClose={handleBack} fullWidth>
      <DialogTitle>
        {handleBack && (
          <IconButton
            onClick={handleBack}
            sx={{
              position: 'absolute',
              right: 12,
              top: 12,
              color: '#D8DEE9',
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <Box className='mainBox'>
        <Box className='statusBox'>
          {!isMatchFail ? (
            <Typography variant={'h4'}>Matching in progress...</Typography>
          ) : (
            <Typography variant={'h4'}>No match found :(</Typography>
          )}
        </Box>
        {open && (
          <CountdownCircleTimer
            key={key}
            isPlaying={isPlaying}
            duration={10}
            size={400}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[30, 20, 10, 0]}
            trailColor='#d6d6d6'
            onComplete={() => setIsMatchFail(true)}
          >
            {renderTime}
          </CountdownCircleTimer>
        )}
        <Grid
          container
          className='mainGrid'
          sx={{ marginTop: '2rem', marginBottom: '2rem' }}
        >
          <Zoom in={true} sx={{ transitionDelay: '1500ms' }}>
            <Grid container item xs={3} justifyContent='center'>
              <Button variant={'outlined'} onClick={handleBack} color={'error'}>
                Cancel match
              </Button>
            </Grid>
          </Zoom>
          {isMatchFail && (
            <Zoom in={true} sx={{ transitionDelay: '1500ms' }}>
              <Grid container item xs={3} justifyContent='center'>
                <Button variant={'contained'} onClick={handleRetry} color={'secondary'}>
                  Retry
                </Button>
              </Grid>
            </Zoom>
          )}
        </Grid>
      </Box>
    </Dialog>
  );
}

export default MatchingPageDialog;
