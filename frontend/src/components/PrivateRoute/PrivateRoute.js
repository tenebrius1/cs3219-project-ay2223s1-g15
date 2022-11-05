import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { tokenLogin } from '../../api/user/auth';
import UserContext from '../../contexts/UserContext';

const PrivateRoute = ({ redirectPath = '/', children }) => {
  const [isPageLoad, setIsPageLoad] = useState(true);
  const { setUser, setImageUrl } = useContext(UserContext);

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

  return isPageLoad ? children : <Navigate to={redirectPath} replace />;
};

export default PrivateRoute;
