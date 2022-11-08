import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { tokenLogin } from '../../api/user/auth';
import UserContext from '../../contexts/UserContext';
import { Backdrop, CircularProgress } from '@mui/material';

const PrivateRoute = ({ redirectPath = '/', children }) => {
  const [isPageLoad, setIsPageLoad] = useState(true);
  const { user, setUser, setImageUrl } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const login = async () => {
      const userInfo = await tokenLogin();
      if (userInfo) {
        setUser(userInfo.username);
        setImageUrl(userInfo.imageUrl);
        setIsPageLoad(true);
      } else {
        setIsPageLoad(false);
        setUser(null);
        setImageUrl(null);
      }
    };
    login().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user])

  return (
    isPageLoad ? (
      <>
        {children}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
    ) : (<Navigate to={redirectPath} replace />)
  )
};

export default PrivateRoute;
