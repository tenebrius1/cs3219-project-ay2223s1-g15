import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { deleteAccount } from '../../api/user/user';
import { logout } from '../../api/user/auth';
import { useNavigate } from 'react-router';
import './profilepage.css';

const DeleteAccount = ({ setShowDeleteAccount }) => {
  const [password, setPassword] = useState('');
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState('');

  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    setShowDeleteMsg(false);
    const deleteResp = await deleteAccount(password);

    if (!deleteResp.isSuccess) {
      setDeleteMsg(deleteResp.message);
      setShowDeleteMsg(true);
      return;
    }
    setDeleteMsg([deleteResp.message, <br />, 'Logging out in 5 seconds']);
    setShowDeleteMsg(true);
    const timer = setTimeout(async () => {
      await logout();
      navigate('/');
    }, 5000);
    return () => clearTimeout(timer);
  };
  return (
    <>
      <TextField
        className='profilePageTextField'
        label='Password'
        variant='outlined'
        type='password'
        size='small'
        margin='dense'
        onChange={(e) => setPassword(e.target.value)}
      />
      {showDeleteMsg && <div className='profilePageResponseMsg'>{deleteMsg}</div>}
      <Box className='profilePageConfirmationBox'>
        <Button
          variant='outlined'
          color='secondary'
          onClick={() => {
            setShowDeleteAccount((prev) => !prev);
            setPassword('');
          }}
        >
          Cancel
        </Button>
        <Button variant='contained' color='error' onClick={handleDeleteAccount}>
          Delete
        </Button>
      </Box>
    </>
  );
};

export default DeleteAccount;
