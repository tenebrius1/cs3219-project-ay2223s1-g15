import { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import { passwordLogin, tokenLogin } from '../../api/user/auth';

function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMsg, setDialogMsg] = useState('');
  const [isSigninSuccess, setIsSigninSuccess] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const { user, setUser, setImageUrl } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignin = async () => {
    const userInfo = await passwordLogin(username, password);
    if (userInfo) {
      setUser(userInfo.username);
      console.log(user);
      setImageUrl(userInfo.imageUrl);
    } else {
      setUser(null);
      setImageUrl(null);
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

  const onSignUpClick = () => {
    navigate('/signup');
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    } else {
      const loginWithToken = async () => {
        const userInfo = await tokenLogin();
        if (userInfo) {
          setUser(userInfo.username);
          setImageUrl(userInfo.imageUrl);
          navigate('/dashboard', { replace: true });
        } else {
          setUser(null);
          setImageUrl(null);
        }
      };
      loginWithToken();
    }
  }, [user]);

  return user ? (
    <Navigate to='/dashboard' replace />
  ) : (
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '2rem',
          }}
        >
          <TextField
            label='Password'
            variant='standard'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: '0.5rem' }}
            required
            error={passwordError}
          />
          <Typography
            component={Link}
            to='/passwordreset'
            color='secondary'
            textAlign={'right'}
          >
            Forgot your password?
          </Typography>
        </Box>
        <Box className='normalButton'>
          <Box sx={{ display: 'flex' }}>
            <Typography>Don't have an account?&nbsp;</Typography>
            <Typography component={Link} to='/signup' color='secondary'>
              Sign up!
            </Typography>
          </Box>
          <Button variant={'contained'} color={'secondary'} onClick={handleSignin}>
            Sign in
          </Button>
        </Box>
      </Box>

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {isSigninSuccess ? (
            <Button component={Link} to='/login'>
              Log in
            </Button>
          ) : (
            <Button onClick={closeDialog}>Done</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SignInPage;
