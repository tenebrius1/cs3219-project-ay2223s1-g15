import { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';

function SignInPage() {
  const { username, setUsername } = useContext(UserContext);
  const [password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMsg, setDialogMsg] = useState('');
  const [isSigninSuccess, setIsSigninSuccess] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSignin = async () => {
    const isLoginSuccess = await auth.passwordLogin(username, password);
    if (isLoginSuccess) {
      navigate('/dashboard');
    } else {
      setErrorDialog('Invalid credentials');
    }
  };

  const closeDialog = () => setIsDialogOpen(false);

  const setSuccessDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle('Success');
    setDialogMsg(msg);
  };

  const setErrorDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle('Error');
    setDialogMsg(msg);
  };

  // On sign in page load
  // 1. Check if auth context already has username. If exists, go to dashboard
  // 2. Carry out token login. If succeed, go to dashboard.
  // 3. Else, stay on sign in page
  useEffect(() => {
    if (auth.user) {
      navigate('/dashboard');
    } else {
      const loginWithToken = async () => {
        const res = await auth.tokenLogin();
        if (res) {
          navigate('/dashboard');
        }
      };
      loginWithToken();
    }
  }, [auth, navigate]);

  return (
    <Box className='mainBox'>
      <Box className='signInBox'>
        <Typography variant={'h3'} marginBottom={'2rem'} textAlign={'center'}>
          Sign In
        </Typography>
      </Box>
      <Box className='textFieldBox'>
        <TextField
          className='TextField'
          label='Username'
          variant='standard'
          color='primary'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ marginBottom: '1rem' }}
          autoFocus
          required
          error={usernameError}
        />
        <TextField
          label='Password'
          variant='standard'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: '2rem' }}
          required
          error={passwordError}
        />
      </Box>
      <Box
        className='normalButton'
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'flex-end'}
      >
        <Button variant={'outlined'} color={'secondary'} onClick={handleSignin}>
          Sign in
        </Button>
      </Box>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Done</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SignInPage;
