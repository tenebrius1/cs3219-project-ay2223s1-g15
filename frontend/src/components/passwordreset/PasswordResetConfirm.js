import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './passwordResetConfirm.css';
import { resetPassword } from '../../api/user/user';

const PasswordResetConfirm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [hasResetPassword, setHasResetPassword] = useState(false);

  const { resetToken } = useParams();
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    setErrMsg('');
    setHasResetPassword(false);
    if (newPassword !== confirmPassword) {
      setErrMsg('Passwords do not match');
      return;
    }
    const resetResp = await resetPassword(newPassword, resetToken);
    if (!resetResp.isSuccess) {
      setErrMsg(resetResp.message);
      return;
    }
    setHasResetPassword(true);
  };

  return (
    <>
      <Box className='mainBox'>
        <Typography
          variant='h3'
          component={'h1'}
          marginBottom={'2rem'}
          textAlign={'center'}
        >
          Reset password
        </Typography>

        {hasResetPassword ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography>Your password has successfully been reset!</Typography>
            <Button
              variant={'contained'}
              color={'secondary'}
              onClick={() => {
                navigate('/login', { replace: true });
              }}
              sx={{ marginTop: '1rem' }}
            >
              To sign in page
            </Button>
          </Box>
        ) : (
          <Box className='textFieldBox'>
            <TextField
              label='New Password'
              variant='filled'
              type='password'
              color='secondary'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ marginBottom: '1rem' }}
              autoFocus={true}
              required
            />
            <TextField
              label='Confirm Password'
              variant='filled'
              type='password'
              color='secondary'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Typography
              sx={{
                marginTop: '5px',
                fontSize: '14px',
                marginLeft: '5px',
                color: 'red',
              }}
            >
              {errMsg}
            </Typography>

            <Box className='normalResetPasswordConfirmButton'>
              <Button
                variant={'contained'}
                color={'secondary'}
                onClick={handlePasswordReset}
                sx={{ alignItems: 'end' }}
              >
                Reset password
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default PasswordResetConfirm;
