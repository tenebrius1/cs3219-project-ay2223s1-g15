import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { deleteAccount } from '../../api/user/user';
import './profilepage.css';
import DeleteSuccessModal from './DeleteSuccessModal';

const DeleteAccount = ({ setShowDeleteAccount }) => {
  const [password, setPassword] = useState('');
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState('');
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);

  const handleDeleteAccount = async () => {
    setShowDeleteMsg(false);
    const deleteResp = await deleteAccount(password);

    if (!deleteResp.isSuccess) {
      setDeleteMsg(deleteResp.message);
      setShowDeleteMsg(true);
      return;
    }
    setIsDeleteSuccess(true);
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
      {showDeleteMsg && (
        <Typography sx={{ color: 'red', fontSize: 12 }}>{deleteMsg}</Typography>
      )}
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
      <DeleteSuccessModal
        isOpen={isDeleteSuccess}
        handleClose={() => setIsDeleteSuccess(false)}
      />
    </>
  );
};

export default DeleteAccount;
