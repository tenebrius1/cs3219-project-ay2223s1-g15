import { useState } from 'react';
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
import axios from 'axios';
import { URL_USER_SVC } from './../../configs';
import { STATUS_CODE_OK, STATUS_CODE_UNAUTHORIZED } from './../../constants';
import { Link } from 'react-router-dom';

function SignInPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMsg, setDialogMsg] = useState('');
    const [isSigninSuccess, setIsSigninSuccess] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleSignin = async () => {
        setIsSigninSuccess(false);

        setUsernameError(false);
        setPasswordError(false);

        if (username === '') {
            setUsernameError(true);
            return;
        }
        if (password === '') {
            setPasswordError(true);
            return;
        }
        const res = await axios
            .post(
                URL_USER_SVC + '/login',
                { username, password },
                { withCredentials: true }
            )
            .catch((err) => {
                if (err.response.status === STATUS_CODE_UNAUTHORIZED) {
                    setErrorDialog('Invalid username and/or password');
                } else {
                    setErrorDialog('Please try again later');
                }
            });
        if (res && res.status === STATUS_CODE_OK) {
            setSuccessDialog('Successfully logged in');
            setIsSigninSuccess(true);
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
