import React from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Typography,
    Zoom,
} from "@mui/material";
import {useState, useEffect} from "react";
import {COUNTDOWN_DURATION} from "../constants";
import {CountdownCircleTimer} from "react-countdown-circle-timer";

var PORT = 8001;


function MatchingPage() {
  const [isMatchFail, setIsMatchFail] = useState(false);
  const [isMatchSuccess, setIsMatchSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [key, setKey] = useState(0);
  const navigate = useNavigate();
  const socket = io.connect(`http://localhost:${PORT}`) 

  useEffect(() => {
    socket.emit('match', `${key}`);
  }, [key]);

  useEffect(() => {
    socket.on('matchFail', () => {
      console.log('matchfail')
      // setIsMatchFail(true);
    });
    socket.on('matchSuccess', () => {
      setIsMatchSuccess(true);
    });
  }, [socket])

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <Typography variant={"h5"} color={"#aaa"}>Do you want to retry?</Typography>;
    }
    return (
      <Box sx={{
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
      }}>
        <Typography variant={"h3"}>{remainingTime}</Typography>
        <Typography variant={"h5"} color={"#aaa"}>seconds</Typography>
      </Box>
    );
  };

  
  const handleRetry = () => {
    setIsMatchFail(false);
    setKey(prevKey => prevKey + 1);
  };

  const handleBack = () => {
    // socket.disconnect();
    navigate();
  };

  return (
      <Box sx={{
        display: 'flex',
        flexDirection:'column',
        alignItems:'center',
        width:'30%',
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection:'column',
          alignItems:'center',
          width:'100%',
          marginBottom:"2rem"
        }}>
          {!isMatchFail?
          <Typography variant={"h4"}>
            Matching in progress...
          </Typography>
          :
          <Typography variant={"h4"}>
            No match found :(
          </Typography>
          }
        </Box>
        <CountdownCircleTimer
          key={key}
          isPlaying={isPlaying}
          duration={COUNTDOWN_DURATION}
          size={400}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[30, 20, 10, 0]}
          trailColor="#d6d6d6"
          onComplete={() => setIsMatchFail(true)}
        >
          {renderTime}
        </CountdownCircleTimer>
        <Grid 
          container
          display="flex"
          flexDirection="row"
          columnGap={4}
          justifyContent="center"
          sx={{marginTop: "2rem"}}
        > 
        {isMatchFail &&
          <Zoom
            in={true}
            sx={{ transitionDelay: '1500ms' }}
          >
            <Grid container item xs={4} justifyContent="center">
              <Button variant={"outlined"} onClick={handleBack}>Back</Button>
            </Grid>
          </Zoom>}
        {isMatchFail && 
          <Zoom
            in={true}
            sx={{ transitionDelay: '1500ms' }}
          >
            <Grid container item xs={4} justifyContent="center">
              <Button variant={"outlined"} onClick={handleRetry}>Retry</Button>
            </Grid>
          </Zoom>}
        </Grid>
      </Box>
  );
}

export default MatchingPage;